import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';
import LifecycleMixin from '../-lifecycle-mixin';

export default Model.extend(LifecycleMixin, {

  doc: null,

  database: readOnly('doc.database'),
  serialized: readOnly('doc.serialized'),

  toStringExtension() {
    return this.get('doc.id');
  }

}).reopenClass({

  debugColumns: [ '_databaseIdentifier', 'serialized' ],

})
