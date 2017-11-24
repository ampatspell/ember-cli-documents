import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({

  db: computed(function() {
    let _lookup = identifier => this.database(identifier);
    return this._documentsModelFactory('databases').create({ _lookup });
  }).readOnly()

});
