import ProxyInternal from './-proxy';

export default class QueryProxyInternal extends ProxyInternal {

  _createLoader() {
    let { owner, query } = this.opts;
    let type = this._loaderType;
    return this.database._createInternalQueryLoader(this, this.owner, { owner, query }, type);
  }

}
