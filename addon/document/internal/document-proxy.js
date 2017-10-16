import QueryProxyInternal from './-query-proxy';

export default class DocumentProxyInternal extends QueryProxyInternal {

  _createModel() {
    return this.store._createDocumentProxy(this);
  }

  get _loaderType() {
    return 'first';
  }

}
