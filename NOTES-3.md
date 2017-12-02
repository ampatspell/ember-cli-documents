## Models with identity

* identifier
* alias
* attr (transform)
* belongsTo filtered, loaded
* hasMany filtered, loaded

* loader
* first -- 1 model filter
* find -- array filter
* Model
* Array Proxy (relationship)
* Model Proxy (relationship)

* model lookup on different stores

``` javascript
// models/blog/blog.js
export default Model.extend({

  id: identifier(),
  name: attr('string'),
  owner: relationship('blog/blog-author'),

  // { ddoc: 'blog', view: 'by-id-with-owner', key: this.get('id') }
  loadWithOwner: loader({
    owner: [ 'id' ],
    query(owner) {
      let key = owner.get('id');
      return { ddoc: 'blog', view: 'by-id-with-owner', key };
    }
  }),

  isLoading: readOnly('loadWithOwner.isLoading'),

  loadSomethingElse: loader(...),
  isBothLoading: and('loadWithOwner.isLoading', 'loadSomethingElse.isLoading'),

});

// {{#if blog.isLoading}}
//   Loading…
// {{else}}
//   {{blog.name}}, {{blog.owner.name}}
// {{/if}}

// models/blog/blog-author.js
export default HasOne.extend({

  parent: null, // blog

  // byId -> find
  // filter: byId({ modelName: 'author', id: 'data.owner' }),

  loader: loader(),

  filter: {
    modelName: 'author', // optimisation for filtering
    relationship: [],
    parent: [ 'data.owner' ],
    model: [ 'id' ],
    matches(model, parent) {
      return model.get('id') === parent.get('data.owner');
    }
  }

});

// models/blog/author.js
export default Model.extend({

  id: identifier(),

  blogs: relationship('blog/author/blogs')

});

// models/blog/author/blogs.js
export default HasMany.extend({

  parent: null, // author

  // filter: byModel({ modelName: 'blog', model: 'owner' }),

  filter: {
    modelName: 'blog', // optimisation for filtering
    relationship: [],
    parent: [],
    model: [ 'owner' ],
    matches(model, parent) {
      return model.get('owner') === parent;
    }
  }

});

// models/blog/authors.js
export default HasMany.extend({

});

// models/blog/blogs.js
export default HasMany.extend({

});

// models/blog.js
export default Model.extend({

  blogs:   relationship('blog/blogs'),
  authors: relationship('blog/authors')

});
```

``` javascript
let state = store.model('blog');

```
