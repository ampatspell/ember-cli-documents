import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':author-details' ],
  layout,

  author: null

});
