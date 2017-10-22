import Ember from 'ember';
import layout from './template';
import { first } from 'documents/properties';

const {
  computed: { reads }
} = Ember;

const byId = first.extend(opts => ({
  owner: [ opts.id ],
  document: [ 'id' ],
  query(owner) {
    let id = owner.get(opts.id);
    return { id };
  },
  matches(doc, owner) {
    return doc.get('id') === owner.get(opts.id);
  }
}));

export default Ember.Component.extend({
  layout,

  id: 'message:first',

  doc: byId({ database: 'db', id: 'id' }),

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
