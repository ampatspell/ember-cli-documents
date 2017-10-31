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
  router: service(),
  documents: reads('stores.identity'),

  actions: {
    select(doc) {
      this.get('router').transitionTo('documents.document', doc.get('id'));
    }
  }

});
