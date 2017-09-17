import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  _internal: null,

  serialized: computed(function() {
    return this.serialize({ type: 'preview' });
  }).readOnly(),

  serialize(opts) {
    return this._internal.serialize(opts);
  }

});
