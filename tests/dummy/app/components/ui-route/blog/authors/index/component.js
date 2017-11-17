import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { property as authors } from 'dummy/models/blog/authors';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-index' ],
  layout,

  router: service(),

  docs: readOnly('state.blog.authors.docs'),
  authors: authors({ docs: 'docs', model: 'blog/author/show' }),

  actions: {
    show(doc) {
      this.get('router').transitionTo('blog.authors.author', doc);
    }
  }

});
