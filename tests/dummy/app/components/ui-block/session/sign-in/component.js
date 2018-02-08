import Component from '@ember/component';
import layout from './template';
import { readOnly } from '@ember/object/computed';
import { store } from 'documents';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':session-sign-in' ],
  layout,

  store: store('remote'),
  session: readOnly('store.session'),

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
