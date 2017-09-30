import Ember from 'ember';
import ModelMixin from '../-model-mixin';
import { markModel } from '../../util/internal';

export default markModel(Ember.ObjectProxy.extend(ModelMixin, {
}));
