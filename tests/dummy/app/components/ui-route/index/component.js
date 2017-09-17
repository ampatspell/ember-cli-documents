import Ember from 'ember';
import layout from './template';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  classNameBindings: [ ':ui-route', ':index' ],
  layout,

  author: computed(function() {
    let author = this.get('db').document({
      _id: 'author:ampatspell',
      type: 'author',
      name: 'ampatspell',
      posts: []
    });
    window.author = author;
    return author;
    // return this.get('db').existing('author:ampatspell');
  })

});
