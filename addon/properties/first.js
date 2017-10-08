import Ember from 'ember';

const {
  computed,
  merge,
  get,
  assert,
  copy
} = Ember;

const createDocumentProxy = (database, opts) => database._createInternalDocumentProxy(opts).model(true);

export default opts => {
  opts = merge({ database: 'database', properties: {} }, opts);
  let keys = Object.values(opts.properties);
  return computed(opts.database, ...keys, function() {
    let owner = this;
    let { database, properties, query, matches } = opts;
    database = this.get(database);
    properties = copy(properties);
    assert(`Database not found for key ${opts.database}`, !!database);
    return createDocumentProxy(database, { owner, properties, query, matches });
  }).readOnly();
};
