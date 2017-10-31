import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';
import firstById from 'documents/properties/first-by-id';
import { prop } from 'documents/properties';

export default Model.extend({

  id: null,
  doc: firstById({ id: prop('id') }),

  serialized: readOnly('doc.serialized'),
  state: readOnly('doc.content.state'),

  async load() {
    await this.get('doc').load();
    return this;
  }

});
