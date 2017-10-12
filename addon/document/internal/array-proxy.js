import ProxyInternal from './-proxy';

export default class ArrayProxyInternal extends ProxyInternal {

  _createModel() {
    return this.store._createArrayProxy(this);
  }

  get _loaderType() {
    return 'find';
  }

  get values() {
    return this.filter(true).values;
  }

}
