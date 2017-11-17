import Ember from 'ember';
import ModelMixin from './-model-mixin';
import TransformMixin from './-array-transform-mixin';
import { property } from './-properties';

const store = property('store');

export default Ember.ArrayProxy.extend(ModelMixin, TransformMixin, {

  store: store()

});
