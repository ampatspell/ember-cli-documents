import Ember from 'ember';

export default Ember.Mixin.create({

  setUnknownProperty(key, value) {
    return this._internal.setValue(key, value);
  },

  unknownProperty(key) {
    return this._internal.getValue(key);
  }

});
