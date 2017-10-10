import Base from './base';
import ModelMixin from './-model-mixin';

// TODO: autoload
// TODO: load on owner property changes -- observe owner in a mixin from filter
export default class LoaderInternal extends ModelMixin(Base) {

  /*
    opts: {
      owner: [ 'id' ],
      query(props) {
        return { id: props.id };
      }
    }
  */
  constructor(store, database, parent, owner, opts) {
    super();
    this.store = store;
    this.database = database;
    this.parent = parent;
    this.owner = owner;
    this.opts = opts;
  }

  _withState(cb) {
    return this.parent.withPropertyChanges(changed => cb(this.parent.state, changed), true);
  }

  _createModel() {
    return this.store._createLoader(this);
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

  get query() {
    let query = this.opts.query;
    let owner = this.owner;
    return query.call(owner, owner);
  }

  scheduleLoad() {
    this._willLoad();
    // TODO: find or first
    return this.database._internalDocumentFirst(this.query).then(() => {
      return this._didLoad();
    }, err => {
      return this._loadDidFail(err);
    });
  }

}
