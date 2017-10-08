import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  session: computed(function() {
    let store = this;
    return this._factoryFor('documents:session').create({ store });
  }).readOnly(),

  willDestroy() {
    let session = this.get('session');
    if(session) {
      session.destroy();
    }
    this._super();
  }

});
