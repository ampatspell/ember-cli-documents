import Ember from 'ember';
import ModelMixin from 'documents/document/-model-mixin';

const {
  computed
} = Ember;

const adapter = () => computed(function() {
  return this._internal.adapter(true, false);
}).readOnly();

export default Ember.Object.extend(ModelMixin, {

  _adapter: adapter()

});
