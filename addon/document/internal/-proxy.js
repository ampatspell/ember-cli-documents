import Base from './base';
import ModelMixin from './-model-mixin';

export default class BaseProxyInternal extends ModelMixin(Base) {

  constructor(store, database, owner, opts) {
    super();
    this.store = store;
    this.database = database;
    this.owner = owner;
    this.opts = opts;
    this._filter = null;
    this._loader = null;
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

  //

  destroy() {
    let model = this.model(false);
    if(model) {
      model.destroy();
    }
  }

}
