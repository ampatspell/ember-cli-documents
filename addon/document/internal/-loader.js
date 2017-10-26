import Ember from 'ember';
import Base from './-base';
import ModelMixin from './-model-mixin';
import ObserveOwner from './-observe-owner';
import DocumentsError from 'documents/util/error';

const {
  RSVP: { resolve, reject, defer, allSettled },
  A,
  merge
} = Ember;

class Operation {

  constructor(loader, opts, fn) {
    this.loader = loader;
    this.opts = opts;
    this.fn = fn;
    this.deferred = defer();
  }

  invoke() {
    let operation = this.fn();
    operation.promise.then(arg => this.deferred.resolve(arg), err => this.deferred.reject(err));
  }

  get promise() {
    return this.deferred.promise;
  }

}

export default class Loader extends ObserveOwner(ModelMixin(Base)) {

  constructor(store, parent, database, owner, opts) {
    super(store, parent);
    this.database = database;
    this.owner = owner;
    this.opts = merge({ autoload: true }, opts);
    this.operations = A();
    this._state = null;
  }

  //

  _ownerValueForKeyDidChange() {
    this._scheduleForceReloadIfLoadable();
  }

  _startObserving() {
    this._startObservingOwner();
  }

  _stopObserving() {
    this._stopObservingOwner();
  }

  //

  _didCreateModel() {
    super._didCreateModel();
    this._startObserving();
  }

  //

  get state() {
    let state = this._state;
    if(!state) {
      state = this._createLoaderState();
      this._state = state;
    }
    return state;
  }

  _stateProp(key) {
    this._scheduleAutoloadIfLoadable([ key ]);
    return this.state[key];
  }

  _withState(cb, except) {
    return this.withPropertyChanges(changed => cb(this.state, changed), true, except);
  }

  // autoload

  _needsLoad() {
    let state = this.state;
    return !state.isLoaded;
  }

  _needsAutoload() {
    if(this.opts.autoload === false) {
      return false;
    }
    let state = this.state;
    return !state.isLoaded && !state.isLoading && !state.isError;
  }

  //

  _createOperation(opts, fn) {
    let operations = this.operations;
    let operation = new Operation(this, opts, fn);
    operation.promise.catch(() => {}).finally(() => operations.removeObject(operation));
    operations.pushObject(operation);
    return operation;
  }

  _lastOperation() {
    let operations = this.operations;
    return operations.get('lastObject');
  }

  settle() {
    return allSettled(this.operations.map(op => op.promise));
  }

  load() {
    if(!this._needsLoad()) {
      return resolve();
    }
    return this._scheduleLoadIfLoadable();
  }

  reload() {
    return this._scheduleReloadIfLoadable();
  }

  //

  _isLoadable(except) {
    let query = this._query();
    if(!query) {
      this._withState((state, changed) => state.onLoadable(false, changed), except);
      return false;
    }
    return true;
  }

  _scheduleAutoloadIfLoadable(except) {
    if(!this._isLoadable(except)) {
      return;
    }
    return this._scheduleAutoload(except);
  }

  _scheduleForceReloadIfLoadable() {
    if(!this._isLoadable()) {
      return;
    }
    return this._scheduleForceReload();
  }

  _rejectNotLoadable() {
    return reject(new DocumentsError({ error: 'loader', reason: 'not_loadable' }));
  }

  _scheduleLoadIfLoadable() {
    if(!this._isLoadable()) {
      return this._rejectNotLoadable();
    }
    return this._scheduleLoad().promise;
  }

  _scheduleReloadIfLoadable() {
    if(!this._isLoadable()) {
      return this._rejectNotLoadable();
    }
    return this._scheduleReload().promise;
  }

  //

  get _modelWillDestroyUnsetsModel() {
    return false;
  }

  _didDestroyModel() {
    super._didDestroyModel();
    this._stopObserving();
  }

  destroy() {
    this._stopObserving();
    let model = this.model();
    if(model) {
      model.destroy();
    }
  }

}
