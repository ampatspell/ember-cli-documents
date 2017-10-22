import Ember from 'ember';
import { find, prop } from './index';

const {
  merge
} = Ember;

export default find.extend(opts => {
  opts = merge({ ids: prop('ids') }, opts);
  opts.ids = prop.wrap(opts.ids);

  let owner;
  let key = opts.ids.key();
  if(key) {
    owner = [ `${key}.[]` ];
  }

  const getIds = owner => {
    let ids = opts.ids.value(owner);
    if(!ids || ids.length === 0) {
      return;
    }
    return ids;
  };

  return {
    owner,
    document: [ 'id' ],
    query(owner) {
      let keys = getIds(owner);
      if(!keys) {
        return;
      }
      return { all: true, keys };
    },
    matches(doc, owner) {
      let ids = getIds(owner);
      if(!ids) {
        return;
      }
      let id = doc.get('id');
      return ids.includes(id);
    }
  };
});
