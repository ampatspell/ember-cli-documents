import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  classNameBindings: [ ':ui-route', ':index' ],
  layout
});
