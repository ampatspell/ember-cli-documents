import { readOnly } from '@ember/object/computed';
import { Model, first, prop } from 'documents';

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

  serialized: readOnly('doc.serialized'),
  state: readOnly('doc.content.state'),

  async load() {
    await this.get('doc').load();
    return this;
  }

});
