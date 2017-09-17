import Ember from 'ember';
import InternalBase from './base';

const {
  A
} = Ember;

export default class InternalArray extends InternalBase {

  static get type() {
    return 'array';
  }

  constructor(store, parent) {
    super(store, parent);
    this.values = A();
  }

  _deserialize(values, changed) {
    this.values.forEach(value => this._detachInternal(value));
    this.values.clear();

    let internals = A(values).map(value => {
      let { internal } = this._deserializeValue(value, undefined);
      return internal;
    });

    this.values.addObjects(internals);
  }

  _serialize(opts, changed) {
    return this.values.map(value => this._serializeValue(value, opts));
  }

}
