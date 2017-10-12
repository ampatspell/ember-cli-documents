import ProxyInternal from './-proxy';

export default class DocumentProxyInternal extends ProxyInternal {

  _createModel() {
    return this.store._createDocumentProxy(this);
  }

  get _loaderType() {
    return 'first';
  }

}
