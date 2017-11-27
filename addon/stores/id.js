import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({

  id: computed(function() {
    let _lookup = identifier => this.store(identifier);
    return this._factoryFor(`documents:stores/id`).create({ _lookup });
  }).readOnly()

});
