import Ember from 'ember';
import layout from './template';

const {
  computed,
  computed: { equal, readOnly }
} = Ember;

const type = value => equal('_type', value).readOnly();

export default Ember.Component.extend({
  classNameBindings: [ ':ui-application' ],
  layout,

  session: readOnly('state.session'),

  type: null,

  _type: computed('type', function() {
    return this.get('type') || 'default';
  }).readOnly(),

  isDefault: type('default'),
  isEmpty: type('empty'),

});
