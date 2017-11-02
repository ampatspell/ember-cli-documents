import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-new' ],
  layout,

  router: service(),

  actions: {
    async save() {
      await this.get('author').save();
      this.get('router').transitionTo('blog.authors');
    }
  }

});
