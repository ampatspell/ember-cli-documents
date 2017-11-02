import Ember from 'ember';
import { find, prop } from 'documents/properties';

const {
  merge
} = Ember;

export const byType = find.extend(opts => {
  opts = merge({ type: prop('type') }, opts);
  opts.type = prop.wrap(opts.type);
  return {
    query(owner) {
      return { ddoc: 'main', view: 'by-type', key: opts.type.value(owner) }
    },
    matches(doc, owner) {
      return doc.get('type') === opts.type.value(owner);
    }
  }
});
