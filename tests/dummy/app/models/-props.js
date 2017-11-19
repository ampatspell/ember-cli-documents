import { merge } from '@ember/polyfills';
import { find, prop } from 'documents';

export const byType = opts => {
  opts = merge({ type: prop('type') }, opts);
  opts.type = prop.wrap(opts.type);
  return find({
    _identifier: 'app/models/-props/byType',
    query(owner) {
      return {
        ddoc: 'main',
        view: 'by-type',
        key: opts.type.value(owner)
      };
    },
    matches(doc, owner) {
      return doc.get('type') === opts.type.value(owner);
    }
  });
};
