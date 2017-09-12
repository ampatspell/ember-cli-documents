import Ember from 'ember';
import layout from './template';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  classNameBindings: [ ':ui-block', ':json' ],
  layout,

  string: computed('value', function() {
    let value = this.get('value');
    return JSON.stringify(value, null, 2);
  })

}).reopenClass({
  positionalParams: [ 'value' ]
});
