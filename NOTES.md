# TODO

* have similar `_normalizeOptions` for model and models like internal -proxy has
* remove extendable
* list `stores.modelsIdentity` in `DataAdapter`
* provide currently matched documents to query (`find-by-ids` loader doesn't need to reload existing docs)
* maybe add `isLoaded` function in proxy opts to determine whether load should happen
* rename `addon/document` to `addon/models` and separate base, documents and proxies
* `InternalModel`, `InternalModels` doesn't need `isDocument`, `serialize`, `deserialize` and stuff like that
* proxy state. deleted doc should have err.error=not_found
* export and reorganize properties
* loader is already loaded if identical query was invoked
* batch identity adds and removes `this._withIdentityMutation(mutation => ...)`
* ember inspector integration (for proxies?)
* array deserialize should diff existing content not just clear existing content
* have a `json` and `toJSON` instead of `serialized` and `serialize`.
* `object.copy()` for documents, objects and arrays. makes a detached, deep copy.
* figure out how to get saves in one `_bulk_docs` call (also `all_or_nothing: true` would be nice option for `db.save(docs)`)
* view reduce proxy for load, reload & underlying internal stuff for that in `db.find` or `db.reduce`
* come up with an API for conflict resolution

# Notes

## all-paginated

``` javascript
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
```
