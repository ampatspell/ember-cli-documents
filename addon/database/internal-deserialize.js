import Ember from 'ember';

const {
  typeOf,
  assert
} = Ember;

const remove = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default Ember.Mixin.create({

  _deserializeInternalObject(internal, values, changed) {
    assert(`values must be object not ${values}`, typeOf(values) === 'object');

    let keys = Object.keys(internal.values);

    for(let key in values) {
      remove(keys, key);
      let value = values[key];
      internal._setValue(key, value, changed);
    }

    keys.forEach(key => this._setValue(key, undefined, changed));
  },

  _deserializeInternal(internal, values, changed) {
    this._assertInternal('object', internal);
    return internal._deserialize(this, values, changed);
  }

});
