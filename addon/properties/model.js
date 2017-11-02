import Ember from 'ember';
import destroyable from './-destroyable';
import { omit } from '../util/object';

const {
  computed,
  merge
} = Ember;

const model = (key, opts) => {
  opts = merge({ store: 'store' }, opts);
  return destroyable(key, {
    create() {
      let store = this.get(opts.store);
      if(!store) {
        return;
      }
      let modelName = opts.type;
      let parent = null;
      let database = null;
      let expanded = omit(opts, [ 'store', 'database', 'type' ]);
      return store._createInternalModel(modelName, parent, database, expanded);
    }
  });
};

export default model;
