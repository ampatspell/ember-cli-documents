import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  security: computed(function() {
    let database = this;
    return this.get('store')._factoryFor('documents:database-security').create({ database });
  }).readOnly(),

  willDestroy() {
    let security = this.cacheFor('security');
    if(security) {
      security.destroy();
    }
    this._super();
  }

});
