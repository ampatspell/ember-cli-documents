import Ember from 'ember';
import ModelMixin from './-model-mixin';

const {
  computed,
  computed: { reads }
} = Ember;

const values = () => computed(function() {
  return this._internal.values;
}).readOnly();

export default Ember.Object.extend(ModelMixin, {

  _internal: null,

  values: values(),
  value: reads('values.firstObject').readOnly(),

});
