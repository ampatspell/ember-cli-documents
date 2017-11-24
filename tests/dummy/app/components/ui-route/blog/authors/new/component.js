import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';
import { doc } from 'dummy/models/-model';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-new' ],
  layout,

  doc: null,
  author: doc({ doc: 'doc', type: 'blog/author/edit' }),

  router: service(),

  actions: {
    async save() {
      await this.get('author').save();
      this.get('router').transitionTo('blog.authors');
    }
  }

});
