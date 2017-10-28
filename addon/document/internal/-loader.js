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

const INVALIDATED = {};

export default class Loader extends ObserveOwner(ModelMixin(Base)) {

  constructor(store, parent, database, owner, opts, type) {
    super(store, parent);
    this.database = database;
    this.owner = owner;
    this.opts = merge({ autoload: true }, opts);
    this.type = type;
    this.operations = A();
    this._state = null;
    this.__query = INVALIDATED;
  }

  //

  _ownerValueForKeyDidChange() {
    this._invalidateQuery();
    this._scheduleReload();
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

  _query() {
    let query = this.__query;
    if(query === INVALIDATED) {
      query = this._createQuery();
      this.__query = query;
    }
    return query;
  }

  _invalidateQuery() {
    this.__query = INVALIDATED;
    this.withPropertyChanges(changed => {
      changed('isLoadable');
      changed('state');
    }, true);
  }

  //

  get _isLoadable() {
    return !!this._query();
  }

  get state() {
    let state = this._state;
    if(!state) {
      state = this._createLoaderState();
      this._state = state;
    }
    return state;
  }

  _stateProp(key) {
    if(key !== 'isLoadable') {
      this._scheduleAutoload([ key ]);
    }
    return this.state[key];
  }

  _withState(cb, except) {
    return this.withPropertyChanges(changed => cb(this.state, changed), true, except);
  }

  //

  settle() {
    return allSettled(this.operations.map(op => op.promise));
  }

  _withRejectNotLoadable(cb) {
    if(!this._isLoadable) {
      return reject(new DocumentsError({ error: 'loader', reason: 'not_loadable' }));
    }
    return cb();
  }

  load() {
    return this._withRejectNotLoadable(() => this._scheduleLoad().promise);
  }

  reload() {
    return this._withRejectNotLoadable(() => this._scheduleReload().promise);
  }

  //

  __scheduleDocumentOperation(query, before, resolve, reject) {
    let database = this.database;
    return database._scheduleDocumentOperation(query, this.type, before, resolve, reject);
  }

  __createOperation(opts, fn) {
    let operations = this.operations;
    let operation = new Operation(this, opts, fn);
    operation.promise.catch(() => {}).finally(() => operations.removeObject(operation));
    operations.pushObject(operation);
    return operation;
  }

  __operationCount() {
    return this.operations.length;
  }

  _scheduleOperation(label, query) {

    // const before  = () => this._withState((state, changed) => state.onLoading(changed));
    // const resolve = () => this._withState((state, changed) => state.onLoaded(changed));
    // const reject  = err => this._withState((state, changed) => state.onError(err, changed));

    console.log('_scheduleOperation', label, query);

    const before  = () => {
      console.log('before');
      if(this.__operationCount() === 1) {
        console.log('onLoading');
        this._withState((state, changed) => state.onLoading(changed));
      }
    };

    const resolve = () => {
      console.log('resolve');
      if(this.__operationCount() === 1) {
        console.log('onLoaded');
        this._withState((state, changed) => state.onLoaded(changed));
      }
    };

    const reject  = err => {
      console.log('reject', err);
      if(this.__operationCount() === 1) {
        console.log('onError');
        this._withState((state, changed) => state.onError(err, changed));
      }
    };

    const fn = () => this.__scheduleDocumentOperation(query, before, resolve, reject);
    let operation = this.__createOperation({ label, query }, fn);

    this._withState((state, changed) => state.onLoadScheduled(changed));

    operation.invoke();
    return operation;
  }

  //

  _needsAutoload() {
    if(this.opts.autoload === false) {
      return false;
    }
    if(!this._isLoadable) {
      return false;
    }
    let state = this.state;
    return !state.isLoaded && !state.isLoading && !state.isError;
  }

  _scheduleAutoload(except) {
    if(!this._needsAutoload()) {
      return;
    }
    console.log('_scheduleAutoload', except);
    // immediately isLoading
  }

  _scheduleLoad() {
    console.log('_scheduleLoad');
    // immediately isLoading
    // reset to { isError:false }
  }

  _scheduleReload() {
    console.log('_scheduleReload');
    // reset to { isLoaded:false, isError:false }
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
