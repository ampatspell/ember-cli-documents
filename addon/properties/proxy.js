import Ember from 'ember';
import { omit } from 'documents/util/object';

const {
  Object: EmberObject,
  computed,
  merge,
  assert
} = Ember;

const __documents_proxy_definition__ = '__documents_proxy_definition__';

const proxy = type => opts => {
  opts = merge({ database: 'database' }, opts);
  return computed(opts.database, function() {
    let database = this.get(opts.database);
    assert(`Database not found for key ${opts.database}`, !!database);
    return database._createInternalProxy(type, this, omit(opts, [ 'database' ])).model(true);
  }).meta({
    [__documents_proxy_definition__]: opts
  }).readOnly();
};

export const first     = proxy('first');
export const find      = proxy('find');
export const paginated = proxy('paginated');

export const getDefinition = (owner, key) => {
  if(EmberObject.detectInstance(owner)) {
    owner = owner.constructor;
  }
  let meta = owner.metaForProperty(key);
  return meta && meta[__documents_proxy_definition__];
};
