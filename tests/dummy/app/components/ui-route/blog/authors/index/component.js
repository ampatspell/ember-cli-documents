import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  layout,

  authors: readOnly('state.blog.authors'),

  actions: {
    select(author) {
      this.get('router').transitionTo('blog.authors.author', author);
    }
  }

});
