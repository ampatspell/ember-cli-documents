import { merge } from '@ember/polyfills';
import destroyable from '../-destroyable';
import { omit } from '../../util/object';
import InternalModel from '../../document/internal/model';
import { withDefinition } from '../-meta';

const _get = (owner, key) => key ? owner.get(key) : null;

const getStoreAndDatabase = (owner, opts) => {
  let store = _get(owner, opts.store);
  let database = _get(owner, opts.database);
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
  return withDefinition(destroyable(...opts.owner, {
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
