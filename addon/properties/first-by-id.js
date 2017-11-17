import Ember from 'ember';
import { first, prop } from './index';
import { isBlank } from '../util/string';

const {
  merge
} = Ember;

export default first.extend(opts => {
  opts = merge({ id: prop('id') }, opts);
  opts.id = prop.wrap(opts.id);
  return {
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
  };
});
