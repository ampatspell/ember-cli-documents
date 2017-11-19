import Mixin from '@ember/object/mixin';

export default Mixin.create({

  setUnknownProperty(key, value) {
    return this._internal.setValue(key, value);
  },

  unknownProperty(key) {
    return this._internal.getValue(key);
  }

});
