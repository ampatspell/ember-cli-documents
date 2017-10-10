import Base from './base';
import ModelMixin from './-model-mixin';
import OwnerPropertiesMixin from './-owner-properties-mixin';

// TODO: autoload
// TODO: load on owner property changes -- observe owner in a mixin from filter
export default class LoaderInternal extends OwnerPropertiesMixin(ModelMixin(Base)) {

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

  _withPropertyChanges() {
    return this.parent.withPropertyChanges(...arguments);
  }

  get _state() {
    return this.parent.state;
  }

  _createModel() {
    return this.store._createLoader(this);
  }

  _willLoad() {
    this._withPropertyChanges(changed => {
      this._state.onLoading(changed);
    }, true);
  }

  _didLoad() {
    this._withPropertyChanges(changed => {
      this._state.onLoaded(changed);
    }, true);
  }

  _loadDidFail(err) {
    this._withPropertyChanges(changed => {
      this._state.onError(err, changed);
    }, true);
  }

  get query() {
    let properties = this._properties;
    let query = this.opts.query;
    return query.call(this.owner, properties);
  }

  scheduleLoad() {
    this._willLoad();
    return this.database._internalDocumentFirst(this.query).then(() => {
      return this._didLoad();
    }, err => {
      return this._loadDidFail(err);
    });
  }

}
