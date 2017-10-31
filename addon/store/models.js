import Ember from 'ember';
import { isString, notBlank, isClass_ } from 'documents/util/assert'
import Model, { Mixin } from 'documents/document/model';

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

  _modelFactory(modelName) {
    notBlank('model name', modelName);
    let documentsModelKey = `documents:model/${modelName}`;
    let factory = this._factoryFor(documentsModelKey);
    if(!factory) {
      factory = this._factoryFor(`model:${modelName}`);
      isClass_(`model for name '${modelName}' is not registered`, factory && factory.class);
      factory = factory.class;
      if(Model.detect(factory)) {
        factory = factory.extend();
      } else {
        factory = factory.extend(Mixin);
      }
      factory.reopenClass({ modelName });
      getOwner(this).register(documentsModelKey, factory);
      factory = this._factoryFor(documentsModelKey);
    }
    return factory;
  },

  _createInternalModel(name, parent, database, opts) {
    let normalizedName = this._normalizeModelName(name);
    let factory = this._modelFactory(normalizedName);
    let InternalModel = this._documentsInternalFactory('model');
    return new InternalModel(this, parent, database, factory, opts);
  },

  _createModel(_internal) {
    let { factory, opts } = _internal;
    return factory.create(merge({ _internal }, opts));
  },

  model(name, opts) {
    return this._createInternalModel(name, null, null, opts).model(true);
  }

});
