import Ember from 'ember';
import destroyable from './-destroyable';
import { omit } from '../util/object';

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
  result = merge(result, opts.create(owner));
  return result;
}

export default opts => {
  opts = merge({ store: 'store', database: 'database', dependencies: [] }, opts);
  return destroyable(...opts.dependencies, {
    create() {
      let { store, database } = getStoreAndDatabase(this, opts);
      if(!store) {
        return;
      }
      let modelOpts = mergeModelOpts(this, opts);
      return store._createInternalModel(opts.type, this, database, modelOpts);
    }
  });
};
