import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Mixin.create({

  _factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  _internalFactory(factoryName) {
    return this._factoryFor(`documents:internal-${factoryName}`).class;
  },

  _createInternalDocument(state, values) {
    let InternalDocument = this._internalFactory('document');
    return new InternalDocument(this, state, values);
  },

  _createInternalObject() {
    let InternalObject = this._internalFactory('object');
    return new InternalObject();
  },

  _createInternalArray() {
    let InternalArray = this._internalFactory('array');
    return new InternalArray();
  }

});
