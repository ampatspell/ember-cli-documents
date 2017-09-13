import Ember from 'ember';
import ModelMixin from './mixins/model';
import InternalMixin from './mixins/internal';
import NestedMixin from './mixins/nested';
import ObjectMixin from './mixins/object';
import { markInternal } from './is-internal';

export default markInternal('object', Ember.Object.extend(ModelMixin, InternalMixin, NestedMixin, ObjectMixin, {

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
