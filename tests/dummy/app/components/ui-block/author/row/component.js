import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':author-row' ],
  layout,

  author: null,

  click() {
    let select = this.get('select');
    select && select();
  }

});
