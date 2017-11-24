import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':session-sign-in' ],
  layout,

  session: readOnly('state.session'),

  actions: {
    async enter() {
      try {
        await this.get('session').save();
        this.attrs.didSignIn && this.attrs.didSignIn();
      } catch(err) {
        if(err.error !== 'unauthorized') {
          throw err;
        }
      }
    }
  }

});
