import Ember from 'ember';
import { first } from './proxy';

const {
  merge
} = Ember;

const buildExcludeNew = (opts, document) => {
  let opt = opts.new;
  if(typeof opt === 'boolean') {
    document.push('isNew');
    return doc => {
      let isNew = doc.get('isNew');
      if(opt === true && !isNew) {
        return true;
      }
      if(opt === false && isNew) {
        return true;
      }
      return false;
    };
  }
  return () => false;
}

export default opts => {
  opts = merge({ id: 'id' }, opts);
  let { database, id } = opts;

  let owner = [ id ];
  let document = [ 'id' ];

  let excludeNew = buildExcludeNew(opts, document);

  return first({
    database,
    owner,
    document,
    query(owner) {
      let id = owner.get('id');
      return { id };
    },
    matches(doc, owner) {
      if(excludeNew(doc)) {
        return;
      }
      let id = owner.get('id');
      return doc.get('id') === id;
    }
  });
};
