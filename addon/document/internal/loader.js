import Ember from 'ember';
import Base from './base';
import ModelMixin from './-model-mixin';
import LoaderState from './-loader-state';
import ObserveOwner from './-observe-owner';

const {
  RSVP: { resolve, defer },
  A
} = Ember;

class Operation {

  constructor(loader, force) {
    this.loader = loader;
    this.force = force;
    this.deferred = defer();
  }

  invoke() {
    let operation = this.loader._scheduleDocumentOperation(this.force);
    operation.promise.then(arg => this.deferred.resolve(arg), err => this.deferred.reject(err));
  }

  get promise() {
    return this.deferred.promise;
  }

}

export default class LoaderInternal extends ObserveOwner(ModelMixin(Base)) {

  /*
    opts: {
      autoload: true,
      owner: [ 'id' ],
      query(props) {
        return { id: props.id };
      }
    }
    type: 'first' / 'find'
  */
  constructor(store, database, owner, opts, type) {
    super();
    this.store = store;
    this.database = database;
    this.owner = owner;
    this.type = type;
    this.opts = opts;
    this.state = new LoaderState();
    this.operations = A();
  }

  _didCreateModel() {
    super._didCreateModel();
    this._startObserving();
  }

  _createModel() {
    return this.store._createLoader(this);
  }

  //

  _state(key) {
    this._scheduleAutoload(false, true, [ key ]);
    return this.state[key];
  }

  _withState(cb, except) {
    return this.withPropertyChanges(changed => cb(this.state, changed), true, except);
  }

  //

  get query() {
    let query = this.opts.query;
    let owner = this.owner;
    return query.call(owner, owner);
  }

  _scheduleDocumentOperation(force) {
    let { database, query } = this;
    if(force) {
      query.force = true;
    }
    return database._scheduleDocumentOperation(query, this.type, () => {
      this._withState((state, changed) => state.onLoading(changed));
    }, () => {
      this._withState((state, changed) => state.onLoaded(changed));
    }, err => {
      this._withState((state, changed) => state.onError(err, changed));
    });
  }

  //

  _scheduleLoad(force, reuse, except) {
    this._withState((state, changed) => state.onLoadScheduled(changed), except);

    let operations = this.operations;
    let operation = operations.get('lastObject');

    // isLoaded should be false onError
    // but the problem is that next autoload is triggered and this thing goes into infinite loop
    // solution is to have state.isAutoload. and then check for that && state.isError
    //
    // if(state.isAutoload && state.isError && isAutoload) { return; }

    if(!operation || !reuse || (force && this.state.isLoaded && !operation.force)) {
      operation = new Operation(this, force);
      operation.promise.catch(() => {}).finally(() => operations.removeObject(operation));
      operations.pushObject(operation);
      operation.invoke();
    }

    return operation;
  }

  _needsAutoload(force) {
    if(this.opts.autoload === false) {
      return false;
    }
    if(force) {
      return true;
    }
    let state = this.state;
    return !state.isLoaded && !state.isLoading;
  }

  _scheduleAutoload(force, reuse, except) {
    if(!this._needsAutoload(force)) {
      return;
    }
    this._scheduleLoad(force, reuse, except);
  }

  load() {
    if(this.state.isLoaded) {
      return resolve();
    }
    return this._scheduleLoad(false, true).promise;
  }

  reload() {
    return this._scheduleLoad(true, true).promise;
  }

  //

  _ownerValueForKeyDidChange() {
    this._scheduleAutoload(true, false);
  }

  _startObserving() {
    this._startObservingOwner();
  }

  _stopObserving() {
    this._stopObservingOwner();
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
