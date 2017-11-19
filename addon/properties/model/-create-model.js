import { A } from '@ember/array';
import { merge } from '@ember/polyfills';
import destroyable from '../-destroyable';
import { omit } from '../../util/object';
import InternalModel from '../../document/internal/model';
import { withDefinition } from '../-meta';
import { isString, isArray } from '../../util/assert';

const _get = (owner, key, name) => {
  if(key) {
    isString(`${name} must be string not ${key}`, key);
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

const mergeModelOpts = (owner, opts) => {
  let result = opts;
  result = omit(result, [ 'store', 'database', 'owner', 'document', 'type', 'create', 'source' ]);
  if(typeof opts.create === 'function') {
    result = merge(result, opts.create(owner));
  }
  return result;
}

const toInternalModel = owner => {
  let internal = owner._internal;
  if(internal instanceof InternalModel) {
    return internal;
  }
  return null;
}

const getType = (owner, opts) => {
  let type = opts.type;
  if(typeof type === 'string') {
    return type;
  }
  if(typeof type === 'function') {
    return type(owner);
  }
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

      let builder = fn => {
        let target = database || store;
        let parent = toInternalModel(this);
        let modelOpts = mergeModelOpts(this, opts, database);
        return fn(target, parent, modelOpts);
      };

      let type = getType(this, opts);
      return factory.create(this, opts, type, builder);
    }
  }), opts).readOnly();
};
