import Ember from 'ember';
import Base from './base';
import ModelMixin from './-model-mixin';
import ObserveOwner from './-observe-owner';

const {
  RSVP: { defer, allSettled },
  A,
  merge
} = Ember;

class Operation {

  constructor(loader, fn) {
    this.loader = loader;
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

  constructor(store, database, owner, opts) {
    super();
    this.store = store;
    this.database = database;
    this.owner = owner;
    this.opts = merge({ autoload: true }, opts);
    this.operations = A();
    this._state = null;
  }

  //

  _ownerValueForKeyDidChange() {
    this._withState((state, changed) => state.onReset(changed));
    this._scheduleAutoload(true, false);
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
    this._scheduleAutoload(false, true, [ key ]);
    return this.state[key];
  }

  _withState(cb, except) {
    return this.withPropertyChanges(changed => cb(this.state, changed), true, except);
  }

  // autoload

  _needsAutoload(force) {
    if(this.opts.autoload === false) {
      return false;
    }
    if(force) {
      return true;
    }
    let state = this.state;
    return !state.isLoaded && !state.isLoading && !state.isError;
  }

  _scheduleAutoload(force, reuse, except) {
    if(!this._needsAutoload(force)) {
      return;
    }
    this._scheduleLoad(force, reuse, except);
  }

  //

  _createOperation(fn) {
    let operations = this.operations;
    let operation = new Operation(this, fn);
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
