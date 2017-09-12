import Ember from 'ember';

const {
  computed,
  getOwner
} = Ember;

export default Ember.Object.extend({

  internalDocuments: computed(function() {
    return Object.create(null);
  }).readOnly(),

  existing(id) {
    let internal = this.get('internalDocuments')[id];
    if(!internal) {
      return null;
    }
    return internal.model();
  },

  _createInternalDocument(doc={}) {
    let Internal = getOwner(this).factoryFor('documents:internal-document');
    let database = this;
    let internal = Internal.create({ database });
    internal.deserialize(doc);
    return internal;
  },

  push(doc) {
    let internal = this._createInternalDocument(doc);
    this.get('internalDocuments')[doc._id] = internal;
    return internal.model();
  }

})
