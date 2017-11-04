import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { markModel } from 'documents/util/internal';
import TransformMixin from './-array-transform-mixin';

export default markModel(Ember.ArrayProxy.extend(ModelMixin, TransformMixin));
