import Ember from 'ember';

const {
  assert
} = Ember;

export default class InternalBase {

  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
    this._model = null;
  }

  //

  model(create) {
    let model = this._model;
    if(!model && create) {
      model = this._createModel();
      this._model = model;
    }
    return model;
  }

  //

  _propertiesDidChange(changed) {
    changed('serialized');
  }

  withPropertyChanges(cb, notify) {
    assert(`withPropertyChanges notify argument must be boolean`, typeof notify === 'boolean');

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
      this._propertiesDidChange(changed);
    }

    if(model && notify) {
      model.endPropertyChanges();
    }

    return result;
  }

}
