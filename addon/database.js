import Ember from 'ember';

const {
  computed,
  getOwner
} = Ember;

export default Ember.Object.extend({

  docs: computed(function() {
    return Object.create(null);
  }).readOnly(),

  existing(id) {
    let internal = this.get('docs')[id];
    if(!internal) {
      return null;
    }
    return internal.get('document');
  },

  _createInternalDocument(doc) {
    let Internal = getOwner(this).factoryFor('documents:internal-document');
    let database = this;
    return Internal.create({ database, doc });
  },

  push(doc) {
    let internal = this._createInternalDocument(doc);
    this.get('docs')[doc._id] = internal;
    return internal.get('document');
  }

})
