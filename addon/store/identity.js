import Ember from 'ember';

const {
  computed,
  A
} = Ember;

export default Ember.Mixin.create({

  identity: computed(function() {
    let _internal = { store: this };
    return this._modelFactory('store/identity').create({ _internal, content: A() });
  }).readOnly()

});
