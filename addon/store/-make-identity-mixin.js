import Ember from 'ember';

const {
  computed
} = Ember;

export default ({ key, factory, content }) => Ember.Mixin.create({

  [key]: computed(function() {
    let _internal = { store: this };
    return this._documentsModelFactory(factory).create({ _internal, content: content.call(this) });
  }).readOnly(),

  willDestroy() {
    let identity = this.cacheFor(key);
    identity && identity.destroy();
    this._super();
  }

});
