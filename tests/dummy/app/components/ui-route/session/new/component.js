import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':session-new' ],
  layout,

  router: service(),
  session: readOnly('state.session'),

  actions: {
    didSignIn() {
      this.get('router').transitionTo('index');
    }
  }

});
