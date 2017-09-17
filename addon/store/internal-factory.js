import Ember from 'ember';
import assertInternal from '../util/assert-internal';

export default Ember.Mixin.create({

  _internalFactory(factoryName) {
    return this._factoryFor(`documents:internal-${factoryName}`).class;
  },

  _createInternalDocument(database) {
    let InternalDocument = this._internalFactory('document');
    return new InternalDocument(this, database);
  },

  _createInternalObject(parent) {
    assertInternal('parent', parent);
    let InternalObject = this._internalFactory('object');
    return new InternalObject(this, parent);
  },

  _createInternalArray(parent) {
    assertInternal('parent', parent);
    let InternalArray = this._internalFactory('array');
    return new InternalArray(this, parent);
  }

});
