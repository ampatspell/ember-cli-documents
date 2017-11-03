import Component from '@ember/component';
import layout from './template';
import { doc } from 'dummy/models/-model';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-author-index' ],
  layout,

  doc: null,
  author: doc({ doc: 'doc', type: 'blog/author/show' }),

});
