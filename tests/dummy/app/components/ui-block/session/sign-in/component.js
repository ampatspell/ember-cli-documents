import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':session-sign-in' ],
  layout,

  session: readOnly('state.session'),

  actions: {
    async enter() {
      try {
        await this.get('session').save();
      } catch(err) {
        if(err.error !== 'unauthorized') {
          throw err;
        }
      }
    }
  }

});
