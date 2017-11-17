import Ember from 'ember';
import EmptyObject from '../util/empty-object';

const {
  on,
  A
} = Ember;

export default Ember.Mixin.create({

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
  }

});
