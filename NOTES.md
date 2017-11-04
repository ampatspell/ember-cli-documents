# TODO

* `authors: models(...)` prop
* models and model with owner observer (?)
* `prop.prefix('author:', 'name')` for `author:zeeba` or undefined
* `prop.concat('blog-post:', prop('author'), ':', prop('id'))` for `blog-post:zeeba:oidqw` or undefined
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

## Models prop

``` javascript
export default Component.extend({

  docs: reads('state.blog.authors.docs'),

  authors: models({
    owner: [ 'docs' ],
    type: 'blog/authors',
    source: 'docs', // owner property which will be observed
    create(owner) {
      // create Models
      return {
        // create Model
        create(doc) {

        }
      }
    },
  })

});

// models/blog/authors.js (or documents:models)
export default Models.extend({

  content: // [ author/show, ... ]

});

// models/blog/author/show.js
export default Model.extend({

});
```
