import Ember from 'ember';
import { paginated } from './proxy';

const {
  merge
} = Ember;

export default opts => {
  opts = merge({ limit: 25, start: null, end: {} }, opts);
  let { database, ddoc, view, type } = opts;

  let limit = opts.limit + 1;
  let endkey = opts.end;

  return paginated({
    database,
    document: [ 'id' ],
    query(owner, state) {
      let skip;
      let startkey;
      let startkey_docid;

      if(state) {
        startkey_docid = state.id;
        startkey = state.value;
        skip = 1;
      } else {
        startkey = opts.start;
      }

      return {
        ddoc,
        view,
        limit,
        skip,
        startkey,
        startkey_docid,
        endkey
      };
    },
    loaded(array) {
      let { length, lastObject } = array.getProperties('length', 'lastObject');

      let isMore = false;
      let state = null;

      if(lastObject) {
        let id = lastObject.get('id');
        state = {
          id: id,
          value: id
        };
        isMore = length > opts.limit;
      }

      return {
        isMore,
        state
      };
    },
    matches(doc) {
      // console.log(doc.getProperties('id', 'type', 'isLoaded'), doc+'');
      return doc.get('type') === type;
    }
  });
}
