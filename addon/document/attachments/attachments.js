import EmberObject, { computed } from '@ember/object';
import ModelMixin from '../-model-mixin';
import UnknownPropertiesMixin from '../-unknown-properties-mixin';

const names = () => computed(function() {
  return this._internal.getNames();
}).readOnly();

export default EmberObject.extend(ModelMixin, UnknownPropertiesMixin, {

  names: names(),

});
