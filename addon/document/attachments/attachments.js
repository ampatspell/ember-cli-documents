import Ember from 'ember';
import ModelMixin from '../-model-mixin';
import UnknownPropertiesMixin from '../-unknown-properties-mixin';

const {
  computed
} = Ember;

const names = () => computed(function() {
  return this._internal.getNames();
}).readOnly();

export default Ember.Object.extend(ModelMixin, UnknownPropertiesMixin, {

  names: names(),

});
