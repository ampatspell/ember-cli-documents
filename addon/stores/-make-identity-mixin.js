import Ember from 'ember';

const {
  getOwner,
  computed,
  A
} = Ember;

export default ({ key, factory }) => Ember.Mixin.create({

  [key]: computed(function() {
    let _internal = { stores: this };
    return getOwner(this).factoryFor(`documents:stores/${factory}`).create({ _internal, content: A() });
  }).readOnly(),

  willDestroy() {
    let identity = this.cacheFor(key);
    identity && identity.destroy();
    this._super();
  }

});
