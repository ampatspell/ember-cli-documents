import Ember from 'ember';
import InternalBase from './base';

const {
  A
} = Ember;

export default class InternalArray extends InternalBase {

  constructor(store, parent) {
    super(store, parent);
    this.vales = A();
  }

  _deserialize(database, ...args) {
    return database._deserializeInternalArray(this, ...args);
  }

}
