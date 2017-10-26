import Ember from 'ember';
import layout from './template';
import { prop } from 'documents/properties';
import byId from 'documents/properties/first-by-id';

const {
  computed: { reads }
} = Ember;

export default Ember.Component.extend({
  layout,

  id: 'message:first',

  doc: byId({ database: 'db', id: prop('id') }),

  subject: reads('doc'),

  actions: {
    load() {
      return this.get('subject').load();
    },
    reload() {
      return this.get('subject').reload();
    }
  }

});
