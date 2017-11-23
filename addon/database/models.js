import Mixin from '@ember/object/mixin';
import { assign } from '@ember/polyfills';
import normalizeModelOpts from '../util/normalize-model-opts';

export default Mixin.create({

  __mergeInternalModelOptions(opts) {
    return assign({ database: this }, opts);
  },

  __createInternalModel(...args) {
    let opts = this.__mergeInternalModelOptions(normalizeModelOpts(...args));
    return this.get('store')._createInternalModel(opts);
  },

  __createInternalModels(opts) {
    opts = this.__mergeInternalModelOptions(opts);
    return this.get('store')._createInternalModels(opts);
  },

  model() {
    return this.__createInternalModel(...arguments).model(true);
  },

  models() {
    return this.__createInternalModels(...arguments).model(true);
  }

});
