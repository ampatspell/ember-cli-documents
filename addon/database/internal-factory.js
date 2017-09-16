import Ember from 'ember';
import InternalBase from '../document/internal/internal-base';

const {
  getOwner,
  assert
} = Ember;

export default Ember.Mixin.create({

  _isInternal(arg) {
    return arg instanceof InternalBase;
  },

  _assertInternal(name, arg) {
    assert(`${name} must be internal object`, this._isInternal(arg));
  },

  _factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  _internalFactory(factoryName) {
    return this._factoryFor(`documents:internal-${factoryName}`).class;
  },

  _createInternalDocument() {
    let InternalDocument = this._internalFactory('document');
    return new InternalDocument(this);
  },

  _createInternalObject(parent) {
    this._assertInternal('parent', parent);
    let InternalObject = this._internalFactory('object');
    return new InternalObject(parent);
  },

  _createInternalArray(parent) {
    this._assertInternal('parent', parent);
    let InternalArray = this._internalFactory('array');
    return new InternalArray(parent);
  }

});
