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

const defaultMatches = () => { return true; };

const buildMatches = (owner, opts) => {
  let matches = get(opts, 'matches');
  return typeof matches === 'function' ? matches : defaultMatches;
}

const lookupDatabase = (owner, opts) => {
  return get(owner, get(opts, 'database'));
}

const createDocumentProxy = (database, query, matches) => {
  if(!database) {
    return;
  }
  if(!query) {
    return;
  }
  return database._createInternalDocumentProxy(query, matches).model(true);
};

const first = opts => {
  opts = merge({ database: 'database', properties: {} }, opts);
  let keys = Object.values(opts.properties);
  return computed(opts.database, ...keys, function() {
    let database = lookupDatabase(this, opts);
    let query = buildQuery(this, opts);
    let matches = buildMatches(this, opts);
    return createDocumentProxy(database, query, matches);
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
