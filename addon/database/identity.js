import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  identity: computed(function() {
    let content = this._documents.all;
    return this.get('store')._modelFactory('database/identity').create({ content });
  }).readOnly(),

  willDestroy() {
    let identity = this.cacheFor('identity');
    identity && identity.destroy();
    this._super();
  }

});
