import Ember from 'ember';
import layout from './template';

const {
  computed,
  merge,
  get,
  assert,
  copy
} = Ember;

const createDocumentProxy = (database, opts) => database._createInternalDocumentProxy(opts).model(true);

const first = opts => {
  opts = merge({ database: 'database', properties: {} }, opts);
  let keys = Object.values(opts.properties);
  return computed(opts.database, ...keys, function() {
    let database = get(this, opts.database);
    assert(`Database not found for key ${opts.database}`, !!database);
    return createDocumentProxy(database, {
      owner: this,
      properties: copy(opts.properties),
      query: opts.query,
      matches: opts.matches
    });
  }).readOnly();
};

const docById = opts => {
  opts = merge({ database: 'database', id: 'id' }, opts);
  let { database, id } = opts;
  return first({
    database,
    properties: { id },
    query(props) {
      let { id } = props;
      return { id };
    },
    matches(doc, props) {
      let { id } = props;
      return doc.get('id') === id;
    }
  });
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
