import Ember from 'ember';
import { prop } from 'documents/properties';
import { find } from 'documents/properties/proxy';

const {
  merge
} = Ember;

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
