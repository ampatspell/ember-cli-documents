import Ember from 'ember';

export default Ember.Mixin.create({

  existing(id) {
    let internal = this._existingInternalDocument(id);
    if(!internal) {
      return null;
    }
    return internal.model();
  }

});
