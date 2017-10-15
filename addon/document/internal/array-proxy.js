import QueryProxyInternal from './-query-proxy';

export default class ArrayProxyInternal extends QueryProxyInternal {

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
