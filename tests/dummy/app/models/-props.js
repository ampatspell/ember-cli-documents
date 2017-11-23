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

// blogs: hasMany({ ddoc: 'blog', id: prop('doc.id'), prop: 'owner' }),
export const hasMany = opts => {
  opts.id = prop.wrap(opts.id);
  return find({
    _identifier: 'app/models/-props/hasMany',
    owner: [ opts.id.key() ],
    document: [ opts.prop ],
    query(owner) {
      let { ddoc, prop, id } = opts;
      let key = id.value(owner);
      if(!key) {
        return;
      }
      let view = `by-${prop}`;
      return {
        ddoc,
        view,
        key
      };
    },
    matches(doc, owner) {
      return doc.get(opts.prop) === opts.id.value(owner);
    }
  });
}
