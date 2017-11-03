import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import layout from './template';
import { info } from 'documents/util/logger';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':blog-index' ],
  layout,

  blog: readOnly('state.blog'),

  actions: {
    select(name, object) {
      window[name] = object;
      info(`window.${name} = ${object}`);
    }
  }

});
