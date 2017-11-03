import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-index' ],
  layout,

  router: service(),

  docs: readOnly('state.blog.authors.docs'),
  // TODO: models
  // authors: models({ ... })

  actions: {
    show(doc) {
      this.get('router').transitionTo('blog.authors.author', doc);
    }
  }

});
