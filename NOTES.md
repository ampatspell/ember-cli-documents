# TODO

* `rev` can't be mutated, `id` can while `state.isNew`

## Computed property teardown

* https://github.com/runspired/rate-limit-computed/blob/master/addon/throttled.js#L35
* https://github.com/machty/ember-concurrency/blob/master/addon/utils.js#L45

## Older notes

```
let db = store.get('db.main');

db.load('person:ampatspell').then(doc => {
  // Document
  doc.get('id');
  doc.get('rev');
  doc.get('attachments');
  doc.get('raw');
});

db.existing('person:ampatspell') // => Document

db.doc({ id: 'person:ampatspell', type: 'person', name: 'ampatspell' });
doc.get('attachments').add('plain', 'hey there');
doc.save().then(doc => {
  // reloaded for _stub
  doc.get('isNew') // => false
});

// people/all
model() {
  return this.get('db').view('people', 'all').then(() => undefined);
}

Component.extend({

  db: reads('store.db.main'),
  people: filter('db', { type: 'person' })

})

{{#each people as |person|}}
  {{ui-block/people/person person=person}}
{{/each}}

Component.extend({

  db: reads('person.db'),
  person: null,

  posts: filter('db', { type: 'person', personId: prop('person.id') })

});

{{person.name}}

{{#each posts as |post|}}
  {{ui-block/blog-post post=post}}
{{/each}}

// create blog post

route() {
  return this.model('blog-post/edit', { db: this.get('store.db.main', id: null });
}

Model.extend({

  id: computed('person.id', 'slug', function() {
    let person = this.get('person.id');
    let slug = this.get('slug');
    return `blog-post:${person}:${slug}`;
  }),

  slug: computed(),

  // changeset forwards
  title: null,
  body: null,

  load({ db, id }) {
    if(id) {
      return db.load(`post:${id}`).then(doc => this.setProperties({ doc }));
    }
  }

});
```
