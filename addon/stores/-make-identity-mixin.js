import Mixin from '@ember/object/mixin';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default ({ key, factory, createInternal }) => Mixin.create({

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
