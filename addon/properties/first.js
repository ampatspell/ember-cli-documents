import Ember from 'ember';

const {
  computed,
  merge,
  assert,
  copy
} = Ember;

const {
  values
} = Object;

const createDocumentProxy = (database, opts) => database._createInternalDocumentProxy(opts).model(true);

export default opts => {
  opts = merge({ database: 'database', properties: {} }, opts);
  return computed(opts.database, ...values(opts.properties), function() {
    let { query, matches } = opts;
    let database = this.get(opts.database);
    let properties = copy(opts.properties);
    assert(`Database not found for key ${opts.database}`, !!database);
    return createDocumentProxy(database, { owner: this, properties, query, matches });
  }).readOnly();
};
