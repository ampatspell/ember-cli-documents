import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';

export const doc = key => readOnly(`doc.${key}`);

export default Model.extend({

  doc: null,

  database: doc('database'),

  id: computed('doc.{id,type}', function() {
    let { id, type } = this.get('doc').getProperties('id', 'type');
    if(!id || !type) {
      return;
    }
    let prefix = `${type}:`;
    if(!id.startsWith(prefix)) {
      return;
    }
    return id.substr(prefix.length);
  }).readOnly(),

  _serializedDocument: readOnly('doc.serialized')

}).reopenClass({
  debugColumns: [ '_serializedDocument' ]
});
