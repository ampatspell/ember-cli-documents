import Component from '@ember/component';
import layout from './template';
import { doc } from 'dummy/models/-model';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':blog-author-row' ],
  layout,

  doc: null,
  author: doc({ doc: 'doc', type: 'blog/author/row' }),

  click() {
    this.attrs.select && this.attrs.select();
  }

});
