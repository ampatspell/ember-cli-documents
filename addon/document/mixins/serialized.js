import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  serialized: computed(function() {
    return this.serialize({ type: 'preview' });
  }).readOnly(),

  serialize(opts) {
    return this._internal.serialize(opts);
  }

});
