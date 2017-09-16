import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Mixin.create({

  _internalObjectFactory() {
    return getOwner(this).factoryFor('documents:internal-object');
  },

  _internalArrayFactory() {
    return getOwner(this).factoryFor('documents:internal-array');
  },

  _createInternalObject() {
    let _parent = this;
    return this._internalObjectFactory().create({ _parent });
  },

  _createInternalArray() {
    let _parent = this;
    return this._internalArrayFactory().create({ _parent });
  }

});
