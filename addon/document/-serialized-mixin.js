import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  serialized: computed(function() {
    return this.serialize();
  }).readOnly(),

  serialize(type='model') {
    return this._internal.serialize(type);
  }

});
