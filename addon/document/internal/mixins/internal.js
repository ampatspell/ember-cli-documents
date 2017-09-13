import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Mixin.create({

  _internalObjectFactory() {
    return getOwner(this).factoryFor('documents:internal-object');
  },

  _createInternalObject() {
    let _parent = this;
    return this._internalObjectFactory().create({ _parent });
  },

});
