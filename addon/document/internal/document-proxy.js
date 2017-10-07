import Base from './base';
import ModelMixin from './-model-mixin';
import ProxyState from './-proxy-state';

export default class DocumentProxyInternal extends ModelMixin(Base) {

  constructor(store, database, query) {
    super();
    this.store = store;
    this.database = database;
    this.query = query;
    this.state = new ProxyState();
    this.content = null;
    window.internal = this;
  }

  _createModel() {
    return this.store._createDocumentProxy(this);
  }

  _setContent(internal, changed) {
    if(this.content === internal) {
      return;
    }
    this.content = internal;
    changed('content');
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

  scheduleLoad() {
    this._willLoad();
    return this.database._internalDocumentFirst(this.query).then(internal => {
      // TODO: Don't populate loaded, filter should automatically pick up loaded doc
      return this._didLoad(internal);
    }, err => {
      return this._loadDidFail(err);
    });
  }

  scheduleReload() {
  }

}
