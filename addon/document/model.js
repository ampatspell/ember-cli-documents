import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { property } from './-properties';

const store = property('store');
const database = property('database');

export default Ember.Object.extend(ModelMixin, {

  store: store(),
  database: database()

});
