import Ember from 'ember';
import layout from './template';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  classNameBindings: [ ':ui-route', ':index' ],
  layout,

  author: computed(function() {
    // return this.get('db').existing('author:ampatspell');
  })

});
