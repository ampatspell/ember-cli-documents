import Base from './base';
import ModelMixin from './-model-mixin';

export default class DocumentProxyInternal extends ModelMixin(Base) {

  constructor(store, database, owner, opts) {
    super();
    this.store = store;
    this.database = database;
    this.owner = owner;
    this.opts = opts;
    this._filter = null;
    this._loader = null;
    window.proxy = this;
  }

  _createModel() {
    return this.store._createDocumentProxy(this);
  }

  //

  _createFilter() {
    let { owner, document, matches } = this.opts;
    return this.database._createInternalFilter(this.owner, { owner, document, matches });
  }

  filter(create) {
    let filter = this._filter;
    if(!filter && create) {
      filter = this._createFilter();
      this._filter = filter;
    }
    return filter;
  }

  //

  _createLoader() {
    let { owner, query } = this.opts;
    return this.database._createInternalLoader(this.owner, { owner, query }, 'first');
  }

  loader(create) {
    let loader = this._loader;
    if(!loader && create) {
      loader = this._createLoader();
      this._loader = loader;
    }
    return loader;
  }

  //

  _didDestroyModel() {
    super._didDestroyModel();

    let filter = this.filter();
    if(filter) {
      filter.destroy();
    }

    let loader = this.loader();
    if(loader) {
      loader.destroy();
    }
  }

}
