import Ember from 'ember';
import InternalBase from './internal-base';

const {
  A
} = Ember;

export default class InternalArray extends InternalBase {

  constructor(parent) {
    super(parent);
    this.vales = A();
  }

  _deserialize(database, ...args) {
    return database._deserializeInternalArray(this, ...args);
  }

}
