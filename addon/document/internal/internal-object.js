import InternalBase from './internal-base';
import EmptyObject from './empty-object';

export default class InternalObject extends InternalBase {

  constructor(parent) {
    super(null, parent);
    this.values = new EmptyObject();
  }

  _setValue(key, value, changed) {
    console.log('internalObject._setValue', key, value);
    return value;
  }

  setValue(key, value) {
    return this.withPropertyChanges(changed => this._setValue(key, value));
  }

  _deserialize(database, ...args) {
    return database._deserializeInternalObject(this, ...args);
  }

}
