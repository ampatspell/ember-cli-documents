import Ember from 'ember';
import layout from './template';

const {
  computed,
  merge,
  get
} = Ember;

const mapProperties = (owner, mapping) => {
  let properties = {};
  for(let key in mapping) {
    properties[key] = get(owner, mapping[key]);
  }
  return properties;
}

const buildQuery = (owner, opts) => {
  let properties = mapProperties(owner, get(opts, 'properties'));
  return opts.query.call(owner, properties);
}

const lookupDatabase = (owner, opts) => {
  return get(owner, get(opts, 'database'));
}

const createDocumentProxy = (database, query) => {
  if(!database) {
    return;
  }
  if(!query) {
    return;
  }
  return database._createInternalDocumentProxy(query).model(true);
};

const first = opts => {
  opts = merge({ database: 'database', properties: {} }, opts);
  let keys = Object.values(opts.properties);
  return computed(opts.database, ...keys, function() {
    let database = lookupDatabase(this, opts);
    let query = buildQuery(this, opts);
    return createDocumentProxy(database, query);
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
