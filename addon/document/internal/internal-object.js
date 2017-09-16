import InternalBase from './internal-base';
import EmptyObject from './empty-object';

const isKeyUnderscored = key => key && key.indexOf('_') === 0;

const remove = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default class InternalObject extends InternalBase {

  constructor(parent) {
    super(null, parent);
    this.values = new EmptyObject();
  }

  _setValue(key, value, changed) {
    console.log('internalObject._setValue', key, value);
    return value;
  }

  _setValueNotify(key, value) {
    return this.withPropertyChanges(changed => this._setValue(key, value));
  }

  _getModelValueNotify(key) {
    return this._getModelValueNotify(key);
  }

  setValue(key, value) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return this._setValueNotify(key, value);
  }

  getValue(key) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return this._getModelValueNotify(key);
  }

  //

  _deserializeInternalObject(internal, values, changed) {
    assert(`values must be object not ${values}`, typeOf(values) === 'object');

    let keys = Object.keys(internal.values);

    for(let key in values) {
      remove(keys, key);
      let value = values[key];
      internal._setValue(key, value, changed);
    }

    keys.forEach(key => this._setValue(key, undefined, changed));
  }

  deserialize() {
    // this._deserializeInternalObject()
  }

}
