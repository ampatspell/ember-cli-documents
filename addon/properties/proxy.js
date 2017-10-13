import Ember from 'ember';
import registerDestroy from './-register-destroy';

const {
  computed,
  merge,
  assert,
  copy
} = Ember;

const matches = () => true;
const query = () => {};

const proxy = factory => opts => {
  opts = merge({ database: 'database', owner: [], document: [], matches, query }, opts);
  return computed(opts.database, function() {
    let { query, matches } = opts;
    let database = this.get(opts.database);
    let owner = copy(opts.owner);
    let document = copy(opts.document);
    assert(`Database not found for key ${opts.database}`, !!database);
    let internal = factory(database, this, { owner, document, matches, query });
    registerDestroy(this, () => internal.destroy());
    return internal.model(true);
  }).readOnly();
};

export const first = proxy((database, ...args) => database._createInternalDocumentProxy(...args));
export const find  = proxy((database, ...args) => database._createInternalArrayProxy(...args));
