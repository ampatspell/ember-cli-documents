import Ember from 'ember';

export default Ember.Mixin.create({

  _internalFactory(factoryName) {
    return this._factoryFor(`documents:internal/${factoryName}`).class;
  },

  _createInternalDocument(database) {
    let InternalDocument = this._internalFactory('document');
    return new InternalDocument(this, database);
  },

  _createInternalObject(parent) {
    let InternalObject = this._internalFactory('object');
    return new InternalObject(this, parent);
  },

  _createInternalArray(parent) {
    let InternalArray = this._internalFactory('array');
    return new InternalArray(this, parent);
  }

});
