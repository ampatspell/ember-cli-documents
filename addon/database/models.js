import Mixin from '@ember/object/mixin';
import { merge } from '@ember/polyfills';

export default Mixin.create({

  __mergeInternalModelOpts(opts) {
    return merge({ database: this }, opts);
  },

  _createInternalModel(name, parent, opts) {
    return this.get('store')._createInternalModel(name, parent, this.__mergeInternalModelOpts(opts));
  },

  _createInternalModels(name, parent, source, opts) {
    return this.get('store')._createInternalModels(name, parent, source, this.__mergeInternalModelOpts(opts));
  },

  model(name, opts) {
    return this._createInternalModel(name, null, opts).model(true);
  },

  models(name, source, opts) {
    return this._createInternalModels(name, null, source, opts).model(true);
  }

});
