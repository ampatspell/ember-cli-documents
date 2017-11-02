import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-author-index' ],
  layout
});
