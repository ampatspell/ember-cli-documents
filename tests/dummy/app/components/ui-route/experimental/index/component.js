import Ember from 'ember';
import layout from './template';
import { docById } from 'documents/properties';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  layout,

  id: 'message:first',

  doc: docById({ database: 'db', id: 'id' }),

  filter: computed(function() {
    let db = this.get('db');
    let filter = db._createInternalFilter(this, {
      owner: { id: 'id' },
      document: { id: 'id' },
      matches(doc, props) {
        return doc.get('id') === props.id;
      }
    });
    window.filter = filter;
    return filter.model(true);
  }),

  actions: {
    async load() {
      let doc = this.get('doc');
      await doc && doc.load();
    }
  }

});
