import { A } from '@ember/array';
import { merge } from '@ember/polyfills';
import destroyable from '../-destroyable';
import InternalModel from '../../document/internal/model';
import { withDefinition } from '../-meta';
import { isString, isArray, isFunction, isObject } from '../../util/assert';

const _get = (owner, key, name) => {
  if(key) {
    isString(name, key);
    return owner.get(key);
  }
  return null;
};

const getStoreAndDatabase = (owner, opts) => {
  let store = _get(owner, opts.store, 'store');
  let database = _get(owner, opts.database, 'database');
  if(!store) {
    if(!database) {
      return {};
    }
    store = database.get('store');
  }
  return { store, database };
}

const toInternalModel = owner => {
  let internal = owner._internal;
  if(internal instanceof InternalModel) {
    return internal;
  }
  return null;
}

const invokeCreate = (owner, opts) => {
  isFunction('create', opts.create);
  let result = opts.create(owner);
  if(!result) {
    return {};
  }
  if(typeof result === 'string') {
    return { type: result };
  }
  isObject('create function result', result);
  let { type, props } = result;
  if(type) {
    isString('type in create function result', type);
  }
  if(props) {
    isObject('props in create function result', props);
  }
  return { type, props };
}

export default factory => opts => {
  opts = merge({ store: 'store', database: 'database', owner: [], document: [] }, opts);
  isArray('owner', opts.owner);
  let owner = A(opts.owner).compact();
  return withDefinition(destroyable(...owner, {
    create() {
      let { store, database } = getStoreAndDatabase(this, opts);

      if(!store) {
        return;
      }

      let target = database || store;
      let parent = toInternalModel(this);
      let { type, props } = invokeCreate(this, opts);

      return factory.create(this, opts, target, type, parent, props);
    }
  }), opts).readOnly();
};
