import Ember from 'ember';
import layout from './template';
import { docById } from 'documents/properties';

const {
  RSVP: { resolve }
} = Ember;

export default Ember.Component.extend({
  layout,

  id: 'message:first',

  doc: docById({ database: 'db', id: 'id' }),

  actions: {
    load() {
      let doc = this.get('doc');
      return resolve(doc && doc.load());
    },
    reload() {
      let doc = this.get('doc');
      return resolve(doc && doc.reload());
    }
  }

});
