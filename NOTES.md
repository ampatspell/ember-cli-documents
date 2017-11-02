# TODO

* `author: model('docProp', { type: 'modelName', ... additional props ... })`
* `prop.prefix('author:', 'name')` for `author:zeeba` or undefined
* `prop.concat('blog-post:', prop('author'), ':', prop('id'))` for `blog-post:zeeba:oidqw` or undefined
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

```javascript
import { model } from 'documents';

let doc = model.extend(opts => {
  opts = merge({ doc: 'doc' }, opts);
  return {
    dependencies: [ opts.doc ],
    create() {
      let doc = this.get(opts.doc);
      if(!doc) {
        return;
      }
      return { doc };
    }
  }
});

export default Model.extend({

  doc: null, // provided
  model: doc({ type: 'duck' }),

});

```

## Models

``` javascript
{
  id: 'author:ampatspell',
  type: 'author',
  name: 'ampatspell',
  email: 'ampatspell@gmail.com'
}

{
  id: 'blog-post:ampatspell:help9e',
  type: 'blog-post',
  author_id: 'ampatspell',
  title: 'Hello',
  body: 'lorem ipsum'
}
```

``` javascript
const attr = _attr('doc');
view({ ddoc: 'blog-post', view: 'by-author', key: prop('authorId') })
attr('string', { key: 'email' }), // defaults to property key
models('docs', { type: 'blog/post', doc: each() })
```

``` javascript
// route/authors/index.js
export default Route.extend({
  async model() {
    await this.get('state.authors').load();
    return undefined;
  }
});
```

``` javascript
// models/state.js
export default Model.extend({

  authors: view({ ddoc: 'author', view: 'all' })

});
```

``` javascript
// components/ui-route/authors/index/component.js
export default Component.extend({

  authors: readOnly('state.authors'),

});
```

``` hbs
{{! components/ui-route/authors/index/template.js }}
{{#each authors as |author|}}
  {{ui-block/author/row author=author}}
{{/each}}
```

``` javascript
// models/author.js
export default Model.extend({

  doc: null, // provided

  // latestPosts: model('doc', { type: 'author/latest-posts', authorId: prop('doc._id') }),
  latestPosts: sortedView({ ddoc: 'blog-post', view: 'by-author-sorted', key: prop('authorId') }) // { start_key: [ <id>, null ], end_key: [ <id>, {} ]

});
```

``` javascript
// components/ui-block/author/row/component.js
export default Component.extend({

  author: null, // doc

  model: model('author', { type: 'author', doc: prop('author') })

});
```

``` hbs
{{! components/ui-block/author/row/template.js }}

{{model.name}}

{{#if model.latestPosts.docs.isLoading}}
  Loading…
{{else}}
  {{#each model.latestPosts.docs as |doc|}}
    {{ui-block/post/info post=doc}}
  {{/each}}
{{/if}}
```
