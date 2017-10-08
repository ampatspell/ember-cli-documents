import Ember from 'ember';
import layout from './template';

const {
  inject: { service },
  computed: { reads }
} = Ember;

export default Ember.Component.extend({
  classNameBindings: [ ':ui-block', ':stores-identity' ],
  layout,

  stores: service(),
  documents: reads('stores.identity'),

});
