import Ember from 'ember';
import { paginated } from '../proxy';

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
    document: [ 'id', 'type' ],
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
    loaded(state_, array) {
      let { length, lastObject: last } = array.getProperties('length', 'lastObject');

      let isMore = false;
      let state = null;

      if(last) {
        let value;
        if(state_) {
          value = array.objectAt(length - 2) || last;
        } else {
          value = last;
        }
        state = {
          id:    last.get('id'),
          value: value.get('id')
        };
        isMore = length > opts.limit;
      }

      return {
        isMore,
        state
      };
    },
    matches(doc, owner, state) {
      if(state) {
        return doc.get('id') < state.value;
      }
      return doc.get('type') === type;
    }
  });
}
