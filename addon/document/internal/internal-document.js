import Ember from 'ember';
import ModelMixin from './mixins/model';
import InternalMixin from './mixins/internal';
import ObjectMixin from './mixins/object';

const isKeyUnderscored = key => key && key.indexOf('_') === 0;

export default Ember.Object.extend(ModelMixin, InternalMixin, ObjectMixin, {

  database: null,

  _modelFactory(owner) {
    return owner.factoryFor('documents:document')
  },

  getId() {
    return this._getModelValue('_id');
  },

  setId(value) {
    return this.withPropertyChanges(changed => this._setModelValue('_id', value, changed));
  },

  getValue(key) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return this._getModelValueNotify(key);
  },

  setValue(key, value) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return this._setModelValueNotify(key, value);
  }

});
