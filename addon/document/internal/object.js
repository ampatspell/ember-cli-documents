import Ember from 'ember';
import InternalBase from './base';
import EmptyObject from 'documents/util/empty-object';
import toInternal from 'documents/util/to-internal';
import isInternal from 'documents/util/is-internal';
import isInternalArray from 'documents/util/is-internal-array';
import toModel from 'documents/util/to-model';

const {
  assert,
  typeOf
} = Ember;

const isKeyUnderscored = key => key && key.indexOf('_') === 0;

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

  constructor(database, parent) {
    super(database, parent);
    this.values = new EmptyObject();
  }

  _createModel() {
    return this.store._createObjectModel(this);
  }

  _setValue(key, value, changed) {
    let values = this.values;
    let current = values[key];

    let { update, internal } = this._deserializeValue(value, current);

    if(update) {
      if(internal === undefined) {
        delete values[key];
      } else {
        values[key] = internal;
      }
      changed(key);
    }

    return internal;
  }

  _getValue(key, changed) {
    return this.values[key];
  }

  _setValueNotify(key, value) {
    return this.withPropertyChanges(changed => this._setValue(key, value, changed), true);
  }

  _getValueNotify(key) {
    return this.withPropertyChanges(changed => this._getValue(key, changed), true);
  }

  setValue(key, value) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return toModel(this._setValueNotify(key, value));
  }

  getValue(key) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return toModel(this._getValueNotify(key));
  }

  //

  _deserialize(values, changed) {
    assert('values must be object', typeOf(values) === 'object');
    let keys = Object.keys(this.values);
    for(let key in values) {
      remove(keys, key);
      let value = values[key];
      this._setValue(key, value, changed);
    }
    keys.forEach(key => this._setValue(key, undefined, changed));
  }

  _serialize(opts, changed) {
    let json = {};
    let values = this.values;
    for(let key in values) {
      let value = values[key];
      value = this._serializeValue(value, opts);
      json[key] = value;
    }
    return json;
  }

}
