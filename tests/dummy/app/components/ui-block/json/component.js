import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  classNameBindings: [ ':ui-block', ':json' ],
  layout,

  string: computed('value', function() {
    let value = this.get('value');
    return JSON.stringify(value, null, 2);
  })

}).reopenClass({
  positionalParams: [ 'value' ]
});
