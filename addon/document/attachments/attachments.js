import Ember from 'ember';
import ModelMixin from '../-model-mixin';
import UnknownPropertiesMixin from '../-unknown-properties-mixin';

export default Ember.Object.extend(ModelMixin, UnknownPropertiesMixin);
