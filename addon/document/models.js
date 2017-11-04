import Ember from 'ember';
import ModelMixin from './-model-mixin';
import TransformMixin from './-array-transform-mixin';

export default Ember.ArrayProxy.extend(ModelMixin, TransformMixin, {
});
