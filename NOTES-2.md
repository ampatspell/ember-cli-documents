# Another approach to models

Might as well go into separate addon.

* have a `models-store` singleton, connect observable array of `documents` to that
* can create new models manually
* can use computed properties to create models manually
* can use computed properties to find and filter models

* can have multiple model stores. each has it's own `documents` so that it is possible to have per-database model stores (or per DS peekAll types)

``` javascript
export default ModelsStore.extend({

  documents: computed(function() {
    return this.get('stores.documentIdentity');
  }),

  // register those things or smth

  document: [ 'type' ],

  modelForDocument(doc) {
    let type = doc.get('type');
    // blog, author, ...
    return {
      type,
      props: { doc }
    };
  },

});
```

``` javascript
models.model('type', props); // model or models
```

``` javascript
// author/blogs.js
export default Models.extend({

  author: null,

  docs: view({ ddoc: 'blog', view: 'by-owner', key: 'owner', value: prop('author.doc.id') }),

  source: filter({
    type: 'blog',
    owner: [ 'author' ],
    matches(model, owner) {
      return model.get('author') === owner;
    }
  })

});
```

``` javascript
let doc = db.doc({ type: 'author' });
let model = models.existing(doc); // model._ref === doc
// model.get('doc') === doc
```
