import Ember from 'ember';

export default Ember.Mixin.create({

  doc(values) {
    let internal = this._createNewInternalDocument(values, 'model');
    return internal.model(true);
  },

  existing(id, opts) {
    let internal = this._existingInternalDocument(id, opts);
    if(!internal) {
      return;
    }
    return internal.model(true);
  },

  array(values) {
    let internal = this._createInternalArray(values, 'model');
    return internal.model(true);
  },

  object(values) {
    let internal = this._createInternalObject(values, 'model');
    return internal.model(true);
  }

});
