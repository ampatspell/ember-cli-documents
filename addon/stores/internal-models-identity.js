import Mixin from '@ember/object/mixin';
import { on } from '@ember/object/evented';
import { A } from '@ember/array';
import EmptyObject from '../util/empty-object';

export default Mixin.create({

  __createModelsIdentity: on('init', function() {
    this._models = new EmptyObject();
    this._models.all = A([]);
  }),

  _registerInternalModel(internal) {
    this._models.all.pushObject(internal);
  },

  __unregisterInternalModel(internal) {
    this._models.all.removeObject(internal);
  },

  _didDestroyInternalModel(internal) {
    this.__unregisterInternalModel(internal);
  },

  _didDestroyInternalModels(internal) {
    this.__unregisterInternalModel(internal);
  },

  willDestroy() {
    this._models.all.forEach(model => model.destroy());
    this._super(...arguments);
  }

});
