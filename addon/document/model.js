import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { property, call } from './-properties';

const store = property('store');

export default Ember.Object.extend(ModelMixin, {

  store: store(),
  model: call('createModel')

});
