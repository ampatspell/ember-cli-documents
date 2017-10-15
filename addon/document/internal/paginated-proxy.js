import ProxyInternal from './-proxy';

export default class PaginatedProxyInternal extends ProxyInternal {

  _createModel() {
    return this.store._createPaginatedProxy(this);
  }

  _createLoader() {
    let { owner, query, loaded } = this.opts;
    return this.database._createInternalPaginatedLoader(this.owner, { owner, query, loaded });
  }

  get values() {
    return this.filter(true).values;
  }

}
