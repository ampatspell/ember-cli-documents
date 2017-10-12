import Ember from 'ember';
import layout from './template';
import { docById, find } from 'documents/properties';

const {
  computed: { reads }
} = Ember;

const byType = opts => {
  let { database, type } = opts;
  return find({
    database,
    owner: [ type ],
    document: [ 'type' ],
    query(owner) {
      let key = owner.get(type);
      return { ddoc: 'main', view: 'by-type', key };
    },
    matches(doc, owner) {
      return doc.get('type') === owner.get(type);
    }
  });
};

export default Ember.Component.extend({
  layout,

  type: 'duck',
  id: 'message:first',

  doc: docById({ database: 'db', id: 'id' }),
  docs: byType({ database: 'db', type: 'type' }),

  subject: reads('docs'),

  actions: {
    load() {
      return this.get('subject').load();
    },
    reload() {
      return this.get('subject').reload();
    }
  }

});
