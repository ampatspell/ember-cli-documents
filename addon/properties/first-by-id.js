import Ember from 'ember';
import { prop } from './index';
import { first } from './proxy';
import { isBlank } from '../util/string';

const {
  merge
} = Ember;

// { id: 'value' }
export default opts => {
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
