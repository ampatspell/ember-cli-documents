import Ember from 'ember';
import destroyable from './-destroyable';
import { omit } from '../util/object';
import InternalModel from '../document/internal/model';

const {
  merge
} = Ember;

const _get = (owner, key) => key ? owner.get(key) : null;

export const getStoreAndDatabase = (owner, opts) => {
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

export const mergeModelOpts = (owner, opts) => {
  let result = opts;
  result = omit(result, [ 'store', 'database', 'dependencies', 'type', 'create' ]);
  result = merge(result, opts.create(owner));
  return result;
}

export const toInternalModel = owner => {
  let internal = owner._internal;
  if(internal instanceof InternalModel) {
    return internal;
  }
  return null;
}

export default opts => {
  opts = merge({ store: 'store', database: 'database', dependencies: [] }, opts);
  return destroyable(...opts.dependencies, {
    create() {
      let { store, database } = getStoreAndDatabase(this, opts);
      if(!store) {
        return;
      }
      let modelOpts = mergeModelOpts(this, opts, database);
      let parent = toInternalModel(this);
      let target = database || store;
      return target._createInternalModel(opts.type, parent, modelOpts);
    }
  });
};
