import ProxyInternal from './-proxy';

export default class QueryProxyInternal extends ProxyInternal {

  _createLoader() {
    let { autoload, owner, query } = this.opts;
    let type = this._loaderType;
    return this.database._createInternalQueryLoader(this, this.owner, { autoload, owner, query }, type);
  }

}
