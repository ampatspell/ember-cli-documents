import Ember from 'ember';
import Base from './-base';
import ModelMixin from './-model-mixin';
import ObserveOwner from './-observe-owner';
import DocumentsError from 'documents/util/error';
import { omit } from 'documents/util/object';

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
    this._needsReload = false;
    this._invalidateQueryDependentKeys = [ 'isLoadable', 'state' ];
  }

  //

  _ownerValueForKeyDidChange() {
    this._invalidateQuery();
    this._setNeedsReload();
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

  __createQuery(opts) {
    let hash = this._createQuery(opts);
    if(!hash) {
      return;
    }
    if(!hash.query) {
      return;
    }
    return hash;
  }

  _query(create, opts) {
    let query = this.__query;
    if(query === INVALIDATED || (create && opts)) {
      if(create) {
        query = this.__createQuery(opts);
        console.log('__createQuery', query);
        this.__query = query;
      } else {
        query = undefined;
      }
    }
    return query;
  }

  _recreateQuery() {
    let query = this.__query;
    if(query === INVALIDATED) {
      query = null;
    }
    return this._query(true, omit(query || {}, [ 'query' ]));
  }

  __invalidateQuery(changed) {
    console.log('__invalidateQuery');
    this.__query = INVALIDATED;
    this._invalidateQueryDependentKeys.forEach(key => changed(key));
  }

  _invalidateQuery() {
    this.withPropertyChanges(changed => this.__invalidateQuery(changed), true);
  }

  //

  get _isLoadable() {
    return !!this._query(true);
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

  _existingOperation(match) {
    let operation = this.operations.get('lastObject');
    if(!operation || !match(operation.opts)) {
      return;
    }
    return operation;
  }

  _operationDidResolve() {
  }

  __operationDidResolve(results) {
    this._withState((state, changed) => state.set({ isLoaded: true }, changed));
    this._operationDidResolve(results);
  }

  _scheduleOperation(label, query, query_) {
    console.log('_scheduleOperation', label, query, query_);

    const before  = () => {
      console.log('before');
      if(this.__operationCount() === 1) {
        console.log('onLoading');
        this._withState((state, changed) => state.onLoading(changed));
      }
    };

    const resolve = info => {
      console.log('resolve');
      this.__operationDidResolve(info);
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

    const fn = () => this.__scheduleDocumentOperation(merge(query_ || {}, query.query), before, resolve, reject);
    let operation = this.__createOperation({ label, query }, fn);

    this._withState((state, changed) => state.onLoadScheduled(changed));

    operation.invoke();
    return operation;
  }

  _resolveOperation() {
    return { promise: resolve() };
  }

  //

  _setNeedsReload() {
    if(this._needsReload === true) {
      return;
    }
    this._needsReload = true;
    this._withState((state, changed) => {
      changed('isLoading');
      changed('isLoaded');
    });
  }

  _needsAutoload() {
    if(this.opts.autoload === false) {
      return false;
    }
    if(!this._isLoadable) {
      return false;
    }
    if(this._needsReload) {
      return true;
    }
    let state = this.state;
    return !state.isLoaded && !state.isLoading && !state.isError;
  }

  _scheduleAutoload(except) {
    if(!this._needsAutoload()) {
      console.log('_scheduleAutoload', 'needs=false');
      return;
    }
    console.log('_scheduleAutoload', except);
    if(this._needsReload) {
      this._scheduleReload();
    } else {
      this._scheduleLoad();
    }
    this._needsReload = false;
  }

  _scheduleLoad() {
    console.log('_scheduleLoad');

    if(this.state.isLoaded) {
      return this._resolveOperation();
    }

    let query = this._query(true);

    let operation = this._existingOperation(opts => opts.query === query);
    if(operation) {
      return operation;
    }

    return this._scheduleOperation('load', query);
  }

  _willScheduleReloadOperation() {
  }

  _scheduleReload() {
    console.log('_scheduleReload');

    this._willScheduleReloadOperation();

    let query = this._query(true);

    let isLoaded = this.state.isLoaded;

    let operation = this._existingOperation(opts => {
      if(opts.query !== query) {
        return;
      }
      if(isLoaded && opts.label !== 'reload') {
        return false;
      }
      return true;
    });

    if(operation) {
      return operation;
    }

    return this._scheduleOperation('reload', query, { force: true });
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
