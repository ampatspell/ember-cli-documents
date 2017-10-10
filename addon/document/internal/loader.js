import Ember from 'ember';
import Base from './base';
import ModelMixin from './-model-mixin';
import LoaderState from './-loader-state';
import ObserveOwner from './-observe-owner';

const {
  RSVP: { resolve },
  assert
} = Ember;

/*

  _load(force, except) {
    let query = this._query;
    if(force) {
      query.force = true;
    }
    this._willLoad(except);
    return this._loadQuery(query)
      .then(() => this._didLoad(), err => this._loadDidFail(err))
      .finally(() => {
        if(!this._needsLoad) {
          return;
        }
        this._needsLoad = false;
        return this._load();
    });
  }

  load() {
    if(this.state.isLoaded) {
      return resolve();
    }
    return this._load();
  }

  reload() {
    return this._load(true);
  }

  _autoload(stateKey, ownerKey) {
    let { isLoading, isLoaded } =this.state;
    if(ownerKey) {
      if(isLoading) {
        this._needsLoad = true;
      } else {
        this._scheduleLoad();
      }
    } else {
      if(!isLoaded && !isLoading) {
        this._scheduleLoad([ stateKey ]);
      }
    }
  }

*/


// TODO: autoload
export default class LoaderInternal extends ObserveOwner(ModelMixin(Base)) {

  /*
    opts: {
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
    this.operation = null;
  }

  _state(key) {
    return this.state[key];
  }

  _didCreateModel() {
    super._didCreateModel();
    this._startObserving();
  }

  _createModel() {
    return this.store._createLoader(this);
  }

  //

  _registerOperation(operation, except) {
    assert(`operation already registered`, !this.operation);
    this.operation = operation;
    this._withState((state, changed) => state.onLoadScheduled(changed));
    operation.promise.catch(() => {}).finally(() => {
      assert(`this.operation must be the same operation`, this.operation === operation);
      this.operation = null;
    });
    return operation;
  }

  get query() {
    let query = this.opts.query;
    let owner = this.owner;
    return query.call(owner, owner);
  }

  _withState(cb, except) {
    return this.withPropertyChanges(changed => cb(this.state, changed), true, except);
  }

  _scheduleOperation(force, except) {
    let { database, query } = this;
    if(force) {
      query.force = true;
    }
    return this._registerOperation(database._scheduleDocumentOperation(query, this.type, () => {
      this._withState((state, changed) => state.onLoading(changed));
    }, result => {
      this._withState((state, changed) => state.onLoaded(changed));
    }, err => {
      this._withState((state, changed) => state.onError(err, changed));
    }), except);
  }

  _load(force) {
    let operation = this.operation;
    if(!operation) {
      operation = this._scheduleOperation(force);
    }
    return operation.promise;
  }

  load() {
    return this._load(false);
  }

  reload() {
    return this._load(true);
  }

  //

  _ownerValueForKeyDidChange(sender, key) {
    // autoload
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
