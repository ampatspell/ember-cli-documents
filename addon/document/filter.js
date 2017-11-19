import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import ModelMixin from './-model-mixin';

const values = () => computed(function() {
  return this._internal.values;
}).readOnly();

export default EmberObject.extend(ModelMixin, {

  _internal: null,

  values: values(),
  value: reads('values.firstObject').readOnly(),

});
