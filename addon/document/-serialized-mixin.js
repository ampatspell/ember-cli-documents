import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({

  serialized: computed(function() {
    return this.serialize();
  }).readOnly(),

  serialize(type='model') {
    return this._internal.serialize(type);
  }

});
