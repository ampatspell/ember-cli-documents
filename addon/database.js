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
    return this.get('docs')[id];
  },

  _createInternalDocument(doc) {
    let Internal = getOwner(this).factoryFor('documents:internal-document');
    let database = this;
    return Internal.create({ database, doc });
  },

  _createDocument(doc) {
    let _internal = this._createInternalDocument(doc);
    return getOwner(this).factoryFor('documents:document').create({ _internal });
  },

  push(doc) {
    let document = this._createDocument(doc);
    this.get('docs')[doc._id] = document;
    return document;
  }

})
