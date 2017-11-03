import Ember from 'ember';
import destroyable from './-destroyable';
import { getStoreAndDatabase, mergeModelOpts, toInternalModel } from './-model';

const {
  merge
} = Ember;

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
      return target._createInternalModels(opts.type, parent, modelOpts);
    }
  });
};
