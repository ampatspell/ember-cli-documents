import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { property } from './-properties';

const store = property('store');

export const Mixin = Ember.Mixin.create(ModelMixin, {

  store: store()

});

export default Ember.Object.extend(Mixin);
