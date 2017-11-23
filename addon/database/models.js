import Mixin from '@ember/object/mixin';
import { assign } from '@ember/polyfills';
import normalizeModelOpts from '../util/normalize-model-opts';

export default Mixin.create({

  __mergeInternalModelOptions(opts) {
    return assign({ database: this }, opts);
  },

  __createInternalModel(opts) {
    opts = this.__mergeInternalModelOptions(normalizeModelOpts(opts));
    return this.get('store')._createInternalModel(opts);
  },

  __createInternalModels(opts) {
    opts = this.__mergeInternalModelOptions(opts);
    return this.get('store')._createInternalModels(opts);
  },

  model(opts) {
    return this.__createInternalModel(opts).model(true);
  },

  models(opts) {
    return this.__createInternalModels(opts).model(true);
  }

});
