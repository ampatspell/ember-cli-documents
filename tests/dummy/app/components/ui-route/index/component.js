import Ember from 'ember';
import layout from './template';

const {
  computed,
  computed: { reads },
  Logger: { info }
} = Ember;

export default Ember.Component.extend({
  classNameBindings: [ ':ui-route', ':index' ],
  layout,

  session: reads('store.session'),

  author: computed(function() {
    return window.author;
  }),

  actions: {
    loadUser() {
      let name = this.get('session.name');
      let id = `org.couchdb.user:${name}`;
      this.get('store').database('_users').find(id).then(user => {
        window.user = user;
        info(user+'');
        info(JSON.stringify(user.get('serialized'), null, 2));
      });
    }
  }

});
