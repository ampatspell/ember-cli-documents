import Ember from 'ember';

const {
  assert
} = Ember;

export default Ember.Mixin.create({

  _serializeInternal(object) {
    this._assertInternal('object', object);
    let json = {};
    return json;
  }

});
/*

  _serialize(value, type) {
    if(value instanceof InternalBase) {
      value = value.serialize(type);
    }
    return value;
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

  __setObjectValue(values, key, current, next, changed) {
    let internal = this.database._createInternalObject(this, next);
    values[key] = internal;
    changed(key);
    return internal;
  }

  _setValue(key, value, changed) {
    let values = this.values;
    let current = values[key];

    if(current === value) {
      return;
    }

    let type = typeOf(value);

    if(type === 'object') {
      value = this.__setObjectValue(values, key, current, value, changed);
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

*/
