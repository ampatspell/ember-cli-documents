import Mixin from '@ember/object/mixin';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';

export default ({ key, factory, content, createInternal }) => Mixin.create({

  [key]: computed(function() {
    let _internal = createInternal.call(this);
    return getOwner(this).factoryFor(`documents:stores/${factory}`).create({ _internal, content: content && content.call(this) });
  }).readOnly(),

  willDestroy() {
    let identity = this.cacheFor(key);
    identity && identity.destroy();
    this._super();
  }

});
