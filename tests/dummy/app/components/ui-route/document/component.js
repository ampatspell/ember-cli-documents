import Component from '@ember/component';
import layout from './template';
import { info } from 'documents/util/logger';

export default Component.extend({
  layout,

  actions: {
    setGlobal() {
      let doc = this.get('document');
      window.doc = doc;
      info(`window.doc = ${doc}`);
    }
  }

});
