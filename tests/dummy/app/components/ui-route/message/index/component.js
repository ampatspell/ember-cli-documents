import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  classNameBindings: [ ':ui-route', ':message-index' ],
  layout,

  actions: {
    save() {
      this.get('message').save();
    }
  }

});
