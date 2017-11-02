# TODO

* test for 2 parallel documentn saves without id
* `prop.prefix('author:', 'name')` for `author:zeeba` or undefined
* `prop.concat('blog-post:', prop('author'), ':', prop('id'))` for `blog-post:zeeba:oidqw` or undefined
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
