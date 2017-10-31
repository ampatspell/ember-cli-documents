# TODO

* models for database (with prefilled `database` property) and for store (with `store` only)
* models should also have an option to be created like props with destroy handling
* provide currently matched documents to query (`find-by-ids` loader doesn't need to reload existing docs)
* maybe add `isLoaded` function in proxy opts to determine whether load should happen
* rename `addon/document` to `addon/models` and separate base, documents and proxies
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

## Models

``` javascript
// blog/:blog_id
export default Route.extend({
  model(params) {
    let id = params.blog_id;
    return this.get('db').model('blog', { id });
  }
});

// blog/:blog_id/posts
export default Route.extend({
  model() {
    let blog = this.modelFor('blog');
    return this.get('db').model('blog/posts', { blog });
  }
});

// models/blog
export default Model.extend({

  id: null,
  doc: byId({ id: prop('id') }),

  isLoading: readOnly('doc.isLoading'),

  title: readOnly('doc.title'),

  posts: model('blog/posts', { blog: prop() }), // prop() => prop('this') => this

});

// models/blog/posts
export default Model.extend({

  blog: null,

  docs: view({ ddoc: 'blog-post', view: 'by-blog', key: prop('blog.id') }),

  isLoading: readOnly('docs.isLoading'),

  all: models('blog/post', 'docs', { doc: prop('@'), blog: prop('blog') }), // prop('@') => docs[i]

  drafts:    filterBy('all', 'state', 'draft'),
  published: filterBy('all', 'state', 'published'),

});
```

## find `{ id }`, `{ ids }`

Basically idea is to support usecases w/o changes listener.

* always load byId, byIds, force means force deserialize?
* but anyway, always mark existing internals `{ isLoading: true }`
* `{ ids }` should reject if some of docs are not found _and_ if any of existing internals are marked deleted

```
db.find({ id, force })
db.find({ ids, force })
```

After that, proxies can come up with load id/ids based on existing models.

Proxy def can have a mixin for `byId`, `byIds` which would choose whether to load existing, loaded docs. Not sure if necessary.
