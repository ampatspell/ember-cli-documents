import Ember from 'ember';
import layout from './template';

const {
  computed,
  computed: { reads }
} = Ember;

export default Ember.Component.extend({
  classNameBindings: [ ':ui-route', ':index' ],
  layout,

  session: reads('store.session'),

  author: computed(function() {
    return window.author;
  })

});
