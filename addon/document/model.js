import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { property, call } from './-properties';

// TODO: maybe have store and database both as internal properties which _can_ be changed
const store = property('store');

export const Mixin = Ember.Mixin.create(ModelMixin, {

  store: store(),
  model: call('createModel')

});

export default Ember.Object.extend(Mixin);
