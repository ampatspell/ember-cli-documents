import Mixin from '@ember/object/mixin';

export default Mixin.create({

  _createInternalModel(name, parent, opts, _ref) {
    return this.get('store')._createInternalModel(name, parent, this, opts, _ref);
  },

  _createInternalModels(name, parent, source, opts) {
    return this.get('store')._createInternalModels(name, parent, this, source, opts);
  },

  model(name, opts) {
    return this._createInternalModel(name, null, opts).model(true);
  },

  models(name, source, opts) {
    return this._createInternalModels(name, null, source, opts).model(true);
  }

});
