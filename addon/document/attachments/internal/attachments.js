export default class Attachments {

  constructor(store, document) {
    this.store = store;
    this.document = document;
    this._model = null;
  }

  _createModel() {
    return this.store._createAttachmentsModel(this);
  }

  model(create) {
    let model = this._model;
    if(!model && create) {
      model = this._createModel();
      this._model = model;
    }
    return model;
  }

  _modelWillDestroy() {
    let model = this._model;
    this._model = null;
  }

}
