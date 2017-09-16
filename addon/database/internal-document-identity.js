import Ember from 'ember';

export default Ember.Mixin.create({

  _identity: null,

  init() {
    this._super(...arguments)
    this._identity = Object.create(null);
  },

  _existingInternalDocument(id) {
    throw new Error('not implemented');
    // return this.get('internalDocuments')[id];
  }

});
