import BaseLoad from './-load';

export default class InternalDocumentReloadOperation extends BaseLoad {

  invoke() {
    if(this.state.isNew) {
      return this.resolve();
    }
    return this._invoke();
  }

}
