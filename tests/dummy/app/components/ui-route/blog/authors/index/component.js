import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-authors-index' ],
  layout,

  authors: readOnly('state.blog.authors')

});
