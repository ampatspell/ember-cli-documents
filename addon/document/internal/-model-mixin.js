export default Class => class ModelMixin extends Class {

  constructor() {
    super(...arguments);
    this._model = null;
  }

  _didCreateModel() {
  }

  _didDestroyModel() {
  }

  model(create) {
    let model = this._model;
    if(!model && create) {
      model = this._createModel();
      this._didCreateModel(model);
      this._model = model;
    }
    return model;
  }

  _destroyModel() {
    let model = this.model(false);
    if(!model) {
      return;
    }
    model.destroy();
  }

  get _modelWillDestroyUnsetsModel() {
    return true;
  }

  _modelWillDestroy() {
    let model = this._model;
    if(this._modelWillDestroyUnsetsModel) {
      this._model = null;
    }
    this._didDestroyModel(model);
  }

}
