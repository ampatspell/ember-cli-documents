import Ember from 'ember';

const {
  computed,
  A
} = Ember;

export default Ember.Mixin.create({

  identity: computed(function() {
    let _internal = { store: this };
    return this._documentsModelFactory('store/identity').create({ _internal, content: A() });
  }).readOnly(),

  willDestroy() {
    let identity = this.cacheFor('identity');
    identity && identity.destroy();
    this._super();
  }

});
