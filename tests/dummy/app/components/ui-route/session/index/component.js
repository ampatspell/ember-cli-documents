import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from './template';

export default Component.extend({
  layout,

  router: service(),

  actions: {
    signOut() {
      this.get('router').transitionTo('session.delete');
    }
  }

});
