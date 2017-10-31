import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { property } from './-properties';

const store = property('store');
const database = property('database');

export const Mixin = Ember.Mixin.create(ModelMixin, {

  store: store(),
  database: database()

});

export default Ember.Object.extend(Mixin);
