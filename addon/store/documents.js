import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({

  documents: computed(function() {
    let adapter = this.get('_adapter');
    return adapter.storeDocuments(this);
  }).readOnly()

});
