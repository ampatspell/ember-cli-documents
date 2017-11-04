import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import models from 'documents/properties/models';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-index' ],
  layout,

  router: service(),

  docs: readOnly('state.blog.authors.docs'),

  // authors: models({ docs: 'docs', type: 'blog/authors', model: { type: 'blog/author/show' } }),

  authors: models({
    owner: [ 'docs' ],
    type: 'blog/authors',
    database: 'docs.database',
    source(owner) {
      return owner.get('docs');
    },
    create() {
    }
  }),

  actions: {
    show(doc) {
      this.get('router').transitionTo('blog.authors.author', doc);
    }
  }

});
