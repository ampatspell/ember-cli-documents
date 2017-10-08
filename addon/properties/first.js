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

export default opts => {
  opts = merge({ database: 'database', owner: {}, document: {} }, opts);
  return computed(opts.database, ...values(opts.owner), function() {
    let { query, matches } = opts;
    let database = this.get(opts.database);
    let owner = copy(opts.owner);
    let document = copy(opts.document);
    assert(`Database not found for key ${opts.database}`, !!database);
    return database._createInternalDocumentProxy(this, { owner, document, matches, query }).model(true);
  }).readOnly();
};
