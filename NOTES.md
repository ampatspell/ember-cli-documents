# TODO

* sometimes continuous feed emits `{ last_seq: value }` only
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

Route as a boundary for model. `state.blogById(id)` returns model, route _may_ have a mixin which destroys model on `deactivate`.

* route-scoped models vs state-scoped

``` javascript
// blog/:blog_id
export default Route.extend({
  model(params) {
    let id = params.blog_id;
    return this.get('state.blogs').loadBlog(id);
  }
});

// blog/:blog_id/posts/:post_id
export default Route.extend({
  model(params) {
    let id = params.post_id;
    let blog = this.modelFor('blog');
    return blog.get('posts').load(id);
  }
});
```

``` javascript
// models/state.js
export default Model.extend({

  blogs: model('blogs', { database: prop('database') }),

});

// models/blogs.js
export default Model.extend({

  docs: view({ ddoc: 'blog', view: 'all' }),

  models: models('blog', 'docs', { doc: prop('@'), blogs: prop('this') }), // each(), prop('this')

  async loadBlog(id) {
    let blog = await this.get('models').byId(id); // what is loading what here?
  }

});
```
