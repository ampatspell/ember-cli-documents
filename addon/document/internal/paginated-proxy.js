import ProxyInternal from './-proxy';

export default class PaginatedProxyInternal extends ProxyInternal {

  _createModel() {
    return this.store._createPaginatedProxy(this);
  }

  get _loaderType() {
    return 'find';
  }

  get values() {
    return this.filter(true).values;
  }

}
