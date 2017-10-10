import Ember from 'ember';
import Base from './base';
import ModelMixin from './-model-mixin';
import LoaderState from './-loader-state';
import ObserveOwner from './-observe-owner';

const {
  RSVP: { resolve }
} = Ember;

// TODO: autoload
// TODO: load on owner property changes -- observe owner in a mixin from filter
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
  }

  _state(key) {
    this._autoload(key, null);
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

  get _query() {
    let query = this.opts.query;
    let owner = this.owner;
    return query.call(owner, owner);
  }

  //

  _withState(cb) {
    return this.withPropertyChanges(changed => cb(this.state, changed), true);
  }

  _willLoad() {
    this._withState((state, changed) => state.onLoading(changed));
  }

  _didLoad() {
    this._withState((state, changed) => state.onLoaded(changed));
  }

  _loadDidFail(err) {
    this._withState((state, changed) => state.onError(err, changed));
  }

  _loadQuery(query) {
    let { type, database } = this;
    if(type === 'first') {
      return database._internalDocumentFirst(query);
    } else if(type === 'find') {
      return database._internalDocumentFind(query);
    }
  }

  _load(force) {
    let query = this._query;
    if(force) {
      query.force = true;
    }
    this._willLoad();
    return this._loadQuery(query).then(() => this._didLoad(), err => this._loadDidFail(err));
  }

  scheduleLoad() {
    if(this.state.isLoaded) {
      return resolve();
    }
    return this._load();
  }

  scheduleReload() {
    return this._load(true);
  }

  _autoload(stateKey, ownerKey) {
    Ember.Logger.info('_autoload', stateKey, ownerKey);
  }

  //

  _ownerValueForKeyDidChange(sender, key) {
    this._autoload(null, key);
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
