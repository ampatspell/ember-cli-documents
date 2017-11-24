# TODO

* lookup generated models in data adapter
* option to set models source as a string: `this.__array = this.model().get(this._array)`
* assert models source item type. `item._internal._ref` thingie
* simplify internal model and models creation -- have a `{ source: array, props: ... }` hash. see `database/models`
* provide currently matched documents to query (`find-by-ids` loader doesn't need to reload existing docs)
* maybe add `isLoaded` function in proxy opts to determine whether load should happen
* rename `addon/document` to `addon/models` and separate base, documents and proxies
* `InternalModel`, `InternalModels` doesn't need `isDocument`, `serialize`, `deserialize` and stuff like that
* proxy state. deleted doc should have err.error=not_found
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

## Configs

`first` and `find`

``` javascript
export default EmberObject.extend({

  doc: first({
    database: 'db',
    autoload: true,
    owner: [],
    document: [],
    query(owner) {
      return {};
    },
    matches(doc, owner) {
      return true;
    }
  })

});
```

`paginated` (will provide both `key` and `range` implementations). See `all-paginated` example on top.

``` javascript
export default EmberObject.extend({

  docs: paginated({
    database: 'db',
    autoload: true,
    owner: [],
    document: [],
    query(owner, state) {
      return {};
    },
    matches(doc, owner, state) {
      return true;
    },
    loaded(state, docs) {
      return { state, isMore };
    }
  })

});
```

`model`

``` javascript
export default EmberObject.extend({

  thing: model({
    store: 'store',
    database: 'db',
    owner: [ ...props ],
    create(owner) {
      return {
        type: 'foo',          // required
        props: { additional } // optional
      };
    }
  })

});
```

`models`

``` javascript
export default EmberObject.extend({

  things: models({
    store: 'store',
    database: 'db',
    owner: [ ...props ],
    create(owner) {
      return {
        type: 'foofs',            // required
        soure: owner.get('docs'), // required
        props: { additional },    // optional
      }
    },
    model: {
      observe: [ ...props ],
      create(doc, models) {
        return {
          type: 'foofs/foof', // required
          props: { doc, models }   // optional
        };
      }
    }
  })

});
```

## Dummy models

``` javascript
// models/state
export default Model.extend({

  session: state('state/session'),
  blog: state('state/blog'),

});

// mdoels/state/session
export default Model.extend({
});

// models/state/blog
export default Model.extend({

  authors: blog('authors'),
  blogs: blog('blogs'),

});

// models/blog/blogs
export default Model.extend({

  docs: byType({ type: 'blog' }),

  models: docs({ type: 'blog/-blogs', model: 'blog/blog' })

});

// models/blog/authors
export default Model.extend({

  docs: byType({ type: 'author' }),

  models: docs({ type: 'blog/-authors', model: 'blog/author' }),

  async load() {
    await this.get('docs').load();
  }

  // or just use db.first()

  async byId(id) {
    await this.load();
    return this.get('models').findBy('id', id);
  }

  async byPermalink(permalink) {
    let id = `author:${permalink}`;
    let author = await this.byId(id);
    assert(`author '${permalink}' not found`, author);
    return author;
  }

});

// models/blog/author
export default Model.extend({

  doc: null,

  id: readOnly('doc.id'),
  permalink: withoutPrefix({ prefix: 'author', value: prop('id') }),

  // relationship model / models
  // if Models would support source declared in Models instance itself, `author/blogs` could be Models
  // do I need to support Model/Models factory? `export default opts => Model.extend(...`?
  blogs: model({ type: 'blog/author/blogs' })

});

// models/blog/author/blogs
export default Model.extend({

  parent: null, // model/blog/author
  docs: hasMany({ type: 'blog', id: prop('parent.id'), key: 'owner' }),

  all: models({ type: 'blog/blog' })

});

// models/blog/author/blogs
// export default Models.extend({
//
//   parent: null,
//   docs: hasMany({ type: 'blog', id: prop('parent.id'), key: 'owner' })
//
// });
//
// store.models({ type: 'blog/author/blogs', source: 'docs', ... });

// models/blog/blog
export default Model.extend({

  doc: null,

  id: readOnly('doc.id'),

});
```
