import Ember from 'ember';
import ModelMixin from './-model-mixin';
import UnknownPropertiesMixin from './-unknown-properties-mixin';
import { markModel } from '../util/internal';

export default markModel(Ember.Object.extend(ModelMixin, UnknownPropertiesMixin));
