import { merge } from '@ember/polyfills';
import { readOnly } from '@ember/object/computed';
import { Model, first, prop } from 'documents';
import { isBlank } from 'documents/util/string';

const byId = opts => {
  opts = merge({ id: prop('id') }, opts);
  opts.id = prop.wrap(opts.id);
  return first({
    owner: [ opts.id.key() ],
    document: [ 'id' ],
    query(owner) {
      let id = opts.id.value(owner);
      if(isBlank(id)) {
        return;
      }
      return { id };
    },
    matches(doc, owner) {
      let id = opts.id.value(owner);
      if(!id) {
        return;
      }
      return doc.get('id') === id;
    }
  });
};

export default Model.extend({

  id: null,
  doc: byId({ id: prop('id') }),

  rev: readOnly('doc.rev'),
  serialized: readOnly('doc.serialized'),
  state: readOnly('doc.content.state'),

  async load() {
    await this.get('doc').load();
    return this;
  }

}).reopenClass({

  debugColumns: [ '_databaseIdentifier', 'id', 'rev', 'state' ]

});
