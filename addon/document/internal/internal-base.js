export default class InternalBase {

  constructor() {
    this._model = null;
  }

  _notifyPropertiesChangedWithModel(model) {

  }

  model(create) {
    let model = this._model;
    if(!model && create) {
      model = this._createModel();
      this._model = model;
    }
    return model;
  }

  withPropertyChanges(cb, notify=true) {
    let model;

    if(notify) {
      model = this.model(false);
    }

    if(model && notify) {
      model.beginPropertyChanges();
    }

    let changes = [];

    let changed = key => {
      if(model && notify) {
        model.notifyPropertyChange(key);
      }
      if(!changes.includes(key)) {
        changes.push(key);
      }
    }

    let result = cb(changed);

    if(notify && changes.length) {
      this._notifyPropertiesChangedWithModel(model);
    }

    if(model && notify) {
      model.endPropertyChanges();
    }

    return result;
  }

  _serialize(value, type) {
    if(value instanceof InternalBase) {
      value = value.serialize(type);
    }
    return value;
  }

}
