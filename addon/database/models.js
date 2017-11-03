import Ember from 'ember';

const {
  merge
} = Ember;

export default Ember.Mixin.create({

  __mergeInternalModelOpts(opts) {
    return merge({ database: this }, opts);
  },

  _createInternalModel(name, parent, opts) {
    return this.get('store')._createInternalModel(name, parent, this.__mergeInternalModelOpts(opts));
  },

  _createInternalModels(name, parent, opts) {
    return this.get('store')._createInternalModels(name, parent, this.__mergeInternalModelOpts(opts));
  },

  model(name, opts) {
    return this._createInternalModel(name, null, opts).model(true);
  },

  models(name, opts) {
    return this._createInternalModels(name, null, opts).model(true);
  }

});
