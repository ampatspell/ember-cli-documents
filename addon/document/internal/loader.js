import Base from './base';
import ModelMixin from './-model-mixin';

export default class LoaderInternal extends ModelMixin(Base) {

  /*
    opts: {
      owner: { id: 'id' },
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

  _createModel() {
    return this.store._createLoader(this);
  }

  _willLoad() {
    this.withPropertyChanges(changed => {
      this.state.onLoading(changed);
    }, true);
  }

  _didLoad(internal) {
    this.withPropertyChanges(changed => {
      this._setContent(internal, changed);
      this.state.onLoaded(changed);
    }, true);
  }

  _loadDidFail(err) {
    this.withPropertyChanges(changed => {
      this.state.onError(err, changed);
    }, true);
  }

  get query() {
    // TODO: query
  }

  scheduleLoad() {
    this._willLoad();
    return this.database._internalDocumentFirst(this.query).then(internal => {
      // TODO: Don't populate loaded, filter should automatically pick up loaded doc
      return this._didLoad(internal);
    }, err => {
      return this._loadDidFail(err);
    });
  }

}
