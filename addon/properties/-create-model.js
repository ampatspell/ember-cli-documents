import Ember from 'ember';
import destroyable from './-destroyable';
import { omit } from '../util/object';
import InternalModel from '../document/internal/model';

const {
  merge
} = Ember;

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
  result = omit(result, [ 'store', 'database', 'dependencies', 'type', 'create' ]);
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

export default factory => opts => {
  opts = merge({ store: 'store', database: 'database', dependencies: [] }, opts);
  return destroyable(...opts.dependencies, {
    create() {
      let { store, database } = getStoreAndDatabase(this, opts);
      if(!store) {
        return;
      }

      let parent = toInternalModel(this);
      let target = database || store;
      let modelOpts = () => mergeModelOpts(this, opts, database);

      return factory.create(this, target, opts, parent, modelOpts);
    }
  });
};
