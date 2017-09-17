import Ember from 'ember';
import BaseMixin from './base-mixin';
import mark from '../util/mark-model';

export default mark(Ember.Object.extend(BaseMixin, {

  setUnknownProperty(key, value) {
    return this._internal.setValue(key, value);
  },

  unknownProperty(key) {
    return this._internal.getValue(key);
  }

}));
