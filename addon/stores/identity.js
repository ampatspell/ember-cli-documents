import Ember from 'ember';

const {
  getOwner,
  computed,
  A
} = Ember;

export default Ember.Mixin.create({

  identity: computed(function() {
    let _internal = { stores: this };
    return getOwner(this).factoryFor('documents:stores/identity').create({ _internal, content: A() });
  }).readOnly()

});
