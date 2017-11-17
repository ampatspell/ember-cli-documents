import Ember from 'ember';
import layout from './template';
import { info } from 'documents/util/logger';

const {
  inject: { service },
  computed: { reads }
} = Ember;

export default Ember.Component.extend({
  classNameBindings: [ ':ui-block', ':stores-identity' ],
  layout,

  stores: service(),
  router: service(),

  documents: reads('stores.documentsIdentity'),
  models: reads('stores.modelsIdentity'),

  actions: {
    doc(doc) {
      this.get('router').transitionTo('documents.document', doc.get('id'));
    },
    model(model) {
      info(`window.model = ${model}`);
      window.model = model;
    }
  }

});
