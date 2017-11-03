import Ember from 'ember';
import { isString, notBlank, isClass_ } from 'documents/util/assert'
import Model from 'documents/document/model';
import Models from 'documents/document/models';
import assert from 'documents/util/assert';

const {
  merge,
  String: { dasherize },
  getOwner
} = Ember;

export default Ember.Mixin.create({

  _normalizeModelName(name) {
    isString('model name', name);
    return dasherize(name);
  },

  _modelFactory(modelName, expectedClass, expectedClassName) {
    notBlank('model name', modelName);
    let documentsModelKey = `documents:model/${modelName}`;
    let factory = this._factoryFor(documentsModelKey);
    if(!factory) {
      factory = this._factoryFor(`model:${modelName}`);
      isClass_(`model for name '${modelName}' is not registered`, factory && factory.class);
      factory = factory.class;
      assert(`model for name '${modelName}' must extend ${expectedClassName}`, expectedClass.detect(factory));
      factory = factory.extend();
      factory.reopenClass({ modelName });
      getOwner(this).register(documentsModelKey, factory);
      factory = this._factoryFor(documentsModelKey);
    }
    return factory;
  },

  _createInternalModel(name, parent, opts) {
    let normalizedName = this._normalizeModelName(name);
    let factory = this._modelFactory(normalizedName, Model, 'Model');
    let InternalModel = this._documentsInternalFactory('model');
    return new InternalModel(this, parent, factory, opts);
  },

  _createInternalModels(name, parent, opts) {
    let normalizedName = this._normalizeModelName(name);
    let factory = this._modelFactory(normalizedName, Models, 'Models');
    let InternalModels = this._documentsInternalFactory('models');
    return new InternalModels(this, parent, factory, opts);
  },

  //

  _createModel(_internal) {
    let { factory, opts } = _internal;
    return factory.create(merge({ _internal }, opts));
  },

  _createModels(_internal) {
    let { factory, opts } = _internal;
    return factory.create(merge({ _internal }, opts));
  },

  //

  model(name, opts) {
    return this._createInternalModel(name, null, opts).model(true);
  },

  models(name, opts) {
    return this._createInternalModels(name, null, opts).model(true);
  },

});
