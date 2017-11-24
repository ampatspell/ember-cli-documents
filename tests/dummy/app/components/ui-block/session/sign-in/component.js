import Component from '@ember/component';
import { changeset } from 'dummy/models/session';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':session-sign-in' ],
  layout,

  changeset: changeset(),

  actions: {
    async enter() {
      try {
        await this.get('changeset').commit();
        this.attrs.didSignIn && this.attrs.didSignIn();
      } catch(err) {
        if(err.error !== 'unauthorized') {
          throw err;
        }
      }
    }
  }

});
