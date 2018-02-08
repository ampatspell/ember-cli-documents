import Mixin from '@ember/object/mixin';
import { getOwner } from '@ember/application';
import { merge } from '@ember/polyfills';
import {
  assert,
  notBlank,
  isClass_
} from '../util/assert'

export default Mixin.create({

  __assertModelClass(modelClass, modelName, expectedClassName, expectedClass) {
    assert(`model for name '${modelName}' must extend ${expectedClassName}`, expectedClass.detect(modelClass));
  },

  ___modelFactory(modelName, expectedClass, expectedClassName, generate) {
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

  _createModel(_internal) {
    let { factory, opts } = _internal;
    return factory.create(merge({ _internal }, opts));
  }

});
