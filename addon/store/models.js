import Ember from 'ember';
import { isString, notBlank, isClass_ } from 'documents/util/assert'

const {
  merge,
  String: { dasherize }
} = Ember;

export default Ember.Mixin.create({

  _normalizeModelName(name) {
    isString('model name', name);
    return dasherize(name);
  },

  _modelFactory(name) {
    notBlank('model name', name);
    let factory = this._factoryFor(`model:${name}`);
    isClass_(`model for name '${name}' is not registered`, factory && factory.class);
    return factory;
  },

  model(name, opts) {
    let normalizedName = this._normalizeModelName(name);
    let factory = this._modelFactory(normalizedName);
    let store = this;
    return factory.create(merge({ store }, opts));
  }

});
