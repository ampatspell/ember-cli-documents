import ModelMixin from './-model-mixin';
import ProxyState from './-proxy-state';

export default class DocumentProxyInternal extends ModelMixin(class {}) {

  constructor(store, opts) {
    super();
    this.store = store;
    this.state = new ProxyState();
    this.opts = opts;
  }

  _createModel() {
    return this.store._createDocumentProxy(this);
  }

}
