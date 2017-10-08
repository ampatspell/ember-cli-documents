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

export default class DocumentProxyInternal extends ModelMixin(Base) {

  constructor(store, database, opts) {
    super();
    this.store = store;
    this.database = database;
    this.opts = opts;
    this.state = new ProxyState();
    this.content = null;
    window.pr = this;
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
