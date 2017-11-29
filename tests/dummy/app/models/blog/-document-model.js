import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';

export default Model.extend({

  doc: null,

  _serializedDocument: readOnly('doc.serialized')

}).reopenClass({
  debugColumns: [ '_serializedDocument' ]
});
