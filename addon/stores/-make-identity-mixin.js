import Ember from 'ember';

const {
  getOwner,
  computed,
  A
} = Ember;

export default ({ key, factory, createInternal }) => Ember.Mixin.create({

  [key]: computed(function() {
    let _internal = createInternal.call(this);
    return getOwner(this).factoryFor(`documents:stores/${factory}`).create({ _internal, content: A() });
  }).readOnly(),

  willDestroy() {
    let identity = this.cacheFor(key);
    identity && identity.destroy();
    this._super();
  }

});
