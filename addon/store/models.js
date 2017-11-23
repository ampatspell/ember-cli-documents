import Mixin from '@ember/object/mixin';
import { merge } from '@ember/polyfills';
import { dasherize } from '@ember/string';
import { getOwner } from '@ember/application';
import {
  assert,
  isString,
  notBlank,
  isObject,
  isClass_
} from 'documents/util/assert'
import Model from 'documents/document/model';
import Models, { generate as modelsGenerate } from 'documents/document/models';

export default Mixin.create({

  _normalizeModelName(name) {
    isString('model name', name);
    return dasherize(name);
  },

  __assertModelClass(modelClass, modelName, expectedClassName, expectedClass) {
    assert(`model for name '${modelName}' must extend ${expectedClassName}`, expectedClass.detect(modelClass));
  },

  _modelFactory(modelName, expectedClass, expectedClassName, generate) {
    notBlank('model name', modelName);
    let documentsModelKey = `documents:model/${modelName}`;
    let factory = this._factoryFor(documentsModelKey);
    if(!factory) {
      factory = this._factoryFor(`model:${modelName}`);
      factory = factory && factory.class;
      if(!factory && generate) {
        factory = generate();
      }
      isClass_(`model for name '${modelName}' is not registered`, factory);
      this.__assertModelClass(factory, modelName, expectedClassName, expectedClass);
      factory = factory.extend();
      factory.reopenClass({ modelName });
      getOwner(this).register(documentsModelKey, factory);
      factory = this._factoryFor(documentsModelKey);
    }
    this.__assertModelClass(factory.class, modelName, expectedClassName, expectedClass);
    return factory;
  },

  __modelFactory(name) {
    let normalizedName = this._normalizeModelName(name);
    return this._modelFactory(normalizedName, Model, 'Model');
  },

  __modelsFactory(name) {
    let normalizedName = this._normalizeModelName(name);
    return this._modelFactory(normalizedName, Models, 'Models', modelsGenerate);
  },

  //

  /*
    {
      database: <Database>,
      type: 'thing',
      props:  { model props },
      _parent: <InternalModel>,
      _ref: <marker>
    }
  */
  _createInternalModel(opts) {
    isObject('opts', opts);
    let { database, type, props, _parent, _ref } = opts;
    let factory = this.__modelFactory(type);
    let InternalModel = this._documentsInternalFactory('model');
    let internal = new InternalModel(this, _parent, database, factory, props, _ref);
    this._registerInternalModel(internal);
    return internal;
  },

    /*
    {
      database: <Database>
      type: 'things',
      source: <Array or ArrayProxy>,
      props:  { models props },
      model: {
        observe: [ ...props ],
        create(doc, models) {
          return { type, props };
        }
      }
      _parent: <InternalModel>
    }
  */
  _createInternalModels(opts) {
    isObject('opts', opts);
    let { database, type, source, props, model, _parent } = opts;
    let factory = this.__modelsFactory(type);
    let InternalModels = this._documentsInternalFactory('models');
    let internal = new InternalModels(this, _parent, database, source, factory, model, props);
    this._registerInternalModel(internal);
    return internal;
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

  model(opts) {
    return this._createInternalModel(opts).model(true);
  },

  models(opts) {
    return this._createInternalModels(opts).model(true);
  },

});
