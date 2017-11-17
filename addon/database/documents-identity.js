import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  documentsIdentity: computed(function() {
    let content = this._documents.all;
    return this.get('store')._documentsModelFactory('database/documents-identity').create({ content });
  }).readOnly(),

  willDestroy() {
    let identity = this.cacheFor('documentsIdentity');
    identity && identity.destroy();
    this._super();
  }

});
