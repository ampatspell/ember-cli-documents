import Base from './base';
import ModelMixin from './-model-mixin';
import ProxyState from './-proxy-state';

/*
  state
  loader -- query
  matcher -- matches
*/

export default class DocumentProxyInternal extends ModelMixin(Base) {

  constructor(store, database, owner, opts) {
    super();
    this.store = store;
    this.database = database;
    this.owner = owner;
    this.opts = opts;
    this.state = new ProxyState();
    this._filter = null;
    window.pr = this;
  }

  _createModel() {
    return this.store._createDocumentProxy(this);
  }

  _createFilter() {
    let { owner, document, matches } = this.opts;
    return this.database._createInternalFilter(this.owner, { owner, document, matches });
  }

  get filter() {
    let filter = this._filter;
    if(!filter) {
      filter = this._createFilter();
      this._filter = filter;
    }
    return filter;
  }

  // _willLoad() {
  //   this.withPropertyChanges(changed => {
  //     this.state.onLoading(changed);
  //   }, true);
  // }

  // _didLoad(internal) {
  //   this.withPropertyChanges(changed => {
  //     this._setContent(internal, changed);
  //     this.state.onLoaded(changed);
  //   }, true);
  // }

  // _loadDidFail(err) {
  //   this.withPropertyChanges(changed => {
  //     this.state.onError(err, changed);
  //   }, true);
  // }

  scheduleLoad() {
    // this._willLoad();
    // return this.database._internalDocumentFirst(this.query).then(internal => {
    //   // TODO: Don't populate loaded, filter should automatically pick up loaded doc
    //   return this._didLoad(internal);
    // }, err => {
    //   return this._loadDidFail(err);
    // });
  }

  scheduleReload() {
  }

}
