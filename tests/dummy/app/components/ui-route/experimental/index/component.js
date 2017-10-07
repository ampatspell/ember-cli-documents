import Ember from 'ember';
import layout from './template';

const {
  computed,
  merge
} = Ember;

const docById = opts => {
  opts = merge({ database: 'database', id: 'id' }, opts);
  return computed(opts.database, opts.id, function() {
    let database = this.get(opts.database);
    if(!database) {
      return;
    }
    let id = this.get(opts.id);
    if(!id) {
      return;
    }
    // TODO: query & content lookup instead of `id`
    let internal = database._createInternalDocumentProxy({ id });
    return internal.model(true);
  }).readOnly();
};

export default Ember.Component.extend({
  layout,

  id: 'message:first',

  doc: docById({ database: 'db', id: 'id' }),

  actions: {
    async load() {
      let doc = this.get('doc');
      await doc && doc.load();
    }
  }

});
