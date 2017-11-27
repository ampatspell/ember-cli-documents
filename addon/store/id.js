import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({

  id: computed(function() {
    let _lookup = identifier => this.database(identifier);
    return this._documentsModelFactory('store/id').create({ _lookup });
  }).readOnly()

});
