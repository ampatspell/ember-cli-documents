import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  _internal: null,

  serialized: computed(function() {
    return this.serialize();
  }).readOnly(),

  serialize(type='model') {
    return this._internal.serialize(type);
  },

  willDestroy() {
    this._internal._modelWillDestroy();
    this._super();
  }

});
