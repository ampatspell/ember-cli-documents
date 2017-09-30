export default Class => class extends Class {

  constructor() {
    super(...arguments);
    this._model = null;
  }

  model(create) {
    let model = this._model;
    if(!model && create) {
      model = this._createModel();
      this._didCreateModel && this._didCreateModel(model);
      this._model = model;
    }
    return model;
  }

  _modelWillDestroy() {
    let model = this._model;
    this._model = null;
    this._didDestroyModel && this._didDestroyModel(model);
  }

}
