import Ember from 'ember';

const {
  computed,
  merge,
  assert
} = Ember;

const proxy = type => opts => {
  opts = merge({ database: 'database' }, opts);
  return computed(opts.database, function() {
    let database = this.get(opts.database);
    assert(`Database not found for key ${opts.database}`, !!database);
    return database._createInternalProxy(type, this, opts).model(true);
  }).readOnly();
};

export const first     = proxy('first');
export const find      = proxy('find');
export const paginated = proxy('paginated');
