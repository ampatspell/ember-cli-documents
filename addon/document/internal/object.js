import InternalBase from './base';
import EmptyObject from 'documents/util/empty-object';
import { toModel } from 'documents/util/internal';

const remove = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default class InternalObject extends InternalBase {

  static get type() {
    return 'object';
  }

  constructor(store, parent) {
    super(store, parent);
    this.values = new EmptyObject();
  }

  _createModel() {
    return this.store._createObjectModel(this);
  }

  _setValue(key, value, type, changed) {
    let values = this.values;
    let current = values[key];

    let { update, internal } = this._deserializeValue(value, current, type);

    if(update) {
      if(internal === undefined) {
        delete values[key];
      } else {
        values[key] = internal;
      }
      changed(key);
      this._dirty(changed);
    }

    return internal;
  }

  _getValue(key) {
    return this.values[key];
  }

  _setValueNotify(key, value, type) {
    return this.withPropertyChanges(changed => this._setValue(key, value, type, changed), true);
  }

  _getValueNotify(key, type) {
    return this.withPropertyChanges(changed => this._getValue(key, type, changed), true);
  }

  setValue(key, value) {
    return toModel(this._setValueNotify(key, value, 'model'));
  }

  getValue(key) {
    return toModel(this._getValueNotify(key, 'model'));
  }

  //

  _deserialize(values, type, changed) {
    let keys = Object.keys(this.values);
    for(let key in values) {
      remove(keys, key);
      let value = values[key];
      this._setValue(key, value, type, changed);
    }
    keys.forEach(key => this._setValue(key, undefined, type, changed));
  }

  _serialize(type) {
    let json = {};
    let values = this.values;
    for(let key in values) {
      let value = values[key];
      value = this._serializeValue(value, type);
      json[key] = value;
    }
    return json;
  }

}
