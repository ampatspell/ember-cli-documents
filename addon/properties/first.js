import Ember from 'ember';

const {
  computed,
  merge,
  assert,
  copy
} = Ember;

const matches = () => true;
const query = () => {};

export default opts => {
  opts = merge({ database: 'database', owner: [], document: [], matches, query }, opts);
  return computed(opts.database, function() {
    let { query, matches } = opts;
    let database = this.get(opts.database);
    let owner = copy(opts.owner);
    let document = copy(opts.document);
    assert(`Database not found for key ${opts.database}`, !!database);
    return database._createInternalDocumentProxy(this, { owner, document, matches, query }).model(true);
  }).readOnly();
};
