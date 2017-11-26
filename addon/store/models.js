import Mixin from '@ember/object/mixin';
import { assign } from '@ember/polyfills';
import normalizeModelOpts from '../util/normalize-model-opts';
import mergeModelOpts from '../util/merge-model-opts';

export default Mixin.create({

  __mergeInternalModelOptions(opts) {
    return mergeModelOpts(opts, { store: this });
  },

  _createInternalModel(...args) {
    let opts = this.__mergeInternalModelOptions(normalizeModelOpts(...args));
    return this.get('stores')._createInternalModel(opts);
  },

  _createInternalModels(opts) {
    opts = this.__mergeInternalModelOptions(opts);
    return this.get('stores')._createInternalModels(opts);
  },

  model() {
    return this._createInternalModel(...arguments).model(true);
  },

  models() {
    return this._createInternalModels(...arguments).model(true);
  }

});
