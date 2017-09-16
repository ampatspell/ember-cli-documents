import Ember from 'ember';
import InternalBase from './internal-base';
import EmptyObject from './empty-object';

const {
  assert,
  typeOf
} = Ember;

const arrayRemoveFirst = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default class InternalObject extends InternalBase {

  constructor(values) {
    super();
    this.values = new EmptyObject();
    this.deserialize(values);
  }

  __setPrimitiveValue(values, key, current, next, changed) {
    if(next === undefined) {
      delete values[key];
    } else {
      values[key] = next;
    }
    changed(key);
    return next;
  }

  _setValue(key, value, changed) {
    let values = this.values;
    let current = values[key];

    if(current === value) {
      return;
    }

    let type = typeOf(value);

    if(type === 'object') {
      console.log('_setValue object', key, value);
    } else if(type === 'array') {
      console.log('_setValue array', key, value);
    } else {
      value = this.__setPrimitiveValue(values, key, current, value, changed);
    }

    return value;
  }

  deserialize(values) {
    assert(`values must be object not ${values}`, typeof values === 'object');
    let keys = Object.keys(this.values);
    this.withPropertyChanges(changed => {
      for(let key in values) {
        arrayRemoveFirst(keys, key);
        let value = values[key];
        this._setValue(key, value, changed);
      }
      keys.forEach(key => this._setValue(key, undefined, changed));
    }, true);
  }

  serialize(type) {
    let json = {};
    let values = this.values;
    for(let key in values) {
      let value = values[key];
      value = this._serialize(value, type);
      json[key] = value;
    }
    return json;
  }

}
