import ProxyInternal from './-proxy';

export default class PaginatedProxyInternal extends ProxyInternal {

  _createModel() {
    return this.store._createPaginatedProxy(this);
  }

  _createLoader() {
    let { owner, query, didLoad } = this.opts;
    console.log(this.opts);
    return this.database._createInternalPaginatedLoader(this.owner, { owner, query, didLoad });
  }

  get values() {
    return this.filter(true).values;
  }

}
