import Base from './base';
import ModelMixin from './-model-mixin';
import ProxyState from './-proxy-state';

// const mapProperties = (owner, mapping) => {
//   let properties = {};
//   for(let key in mapping) {
//     properties[key] = get(owner, mapping[key]);
//   }
//   return properties;
// }

// const buildQuery = (owner, opts) => {
//   let properties = mapProperties(owner, get(opts, 'properties'));
//   return opts.query.call(owner, properties);
// }

/*
  state
  loader -- query
  matcher -- matches
*/

const ContentMixin = Class => class Content extends Class {

  constructor() {
    super(...arguments);
    this._content = null;
  }

  content(create) {
    let content = this._content;
    if(!content) {
      return null;
    }
    return content.model(create);
  }

  _setContent(internal, changed) {
    if(this._content === internal) {
      return;
    }
    this.content = internal;
    changed('content');
  }

}

export default class DocumentProxyInternal extends ContentMixin(ModelMixin(Base)) {

  constructor(store, database, opts) {
    super();
    this.store = store;
    this.database = database;
    this.opts = opts;
    this.state = new ProxyState();
    window.pr = this;
  }

  _createModel() {
    return this.store._createDocumentProxy(this);
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
