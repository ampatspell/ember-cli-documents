import Ember from 'ember';
import InternalBase from './base';
import EmptyObject from 'documents/util/empty-object';
import toInternal from 'documents/util/to-internal';
import isInternal from 'documents/util/is-internal';
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

  constructor(database, parent) {
    super(database, parent);
    this.values = new EmptyObject();
  }

  _setValue(key, value, changed) {

    value = toInternal(value);

    if(isInternal(value)) {
      throw new Error('_setValue with internal is not supported yet');
    }

    let values = this.values;
    let current = values[key];

    if(current === value) {
      return value;
    }

    values[key] = value;
    changed(key);

    return value;
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

  _deserialize(values, changed, opts) {
    assert(`values must be object not ${values}`, typeOf(values) === 'object');
    let keys = Object.keys(this.values);
    for(let key in values) {
      remove(keys, key);
      let value = values[key];
      this._setValue(key, value, changed);
    }
    keys.forEach(key => this._setValue(key, undefined, changed));
  }

  deserialize(values, opts) {
    this.withPropertyChanges(changed => this._deserialize(values, changed, opts));
  }

  //

  _serialize(opts, changed) {

  }

  serialize(opts) {
    return this.withPropertyChanges(changed => this._serialize(opts, changed));
  }

}
