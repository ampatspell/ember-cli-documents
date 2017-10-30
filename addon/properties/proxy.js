import Ember from 'ember';
import { omit } from 'documents/util/object';
import destroyable from './-destroyable';

const {
  Object: EmberObject,
  merge
} = Ember;

const __documents_proxy_definition__ = '__documents_proxy_definition__';

const proxy = type => opts => {
  opts = merge({ database: 'database' }, opts);
  return destroyable(opts.database, {
    create() {
      let database = this.get(opts.database);
      if(!database) {
        return;
      }
      return database._createInternalProxy(type, this, omit(opts, [ 'database' ]));
    },
    get(internal) {
      return internal.model(true);
    }
  }).meta({ [__documents_proxy_definition__]: opts }).readOnly();
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
