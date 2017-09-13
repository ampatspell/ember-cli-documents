import Ember from 'ember';
import ModelMixin from './mixins/model';
import ValuesMixin from './mixins/values';
import { markInternal } from './is-internal';

export default markInternal('object', Ember.Object.extend(ModelMixin, ValuesMixin, {

  _modelFactory(owner) {
    return owner.factoryFor('documents:object');
  },

  getValue(key) {
    return this._getModelValueNotify(key);
  },

  setValue(key, value) {
    return this._setModelValueNotify(key, value);
  }

}));
