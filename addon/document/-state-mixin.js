import Ember from 'ember';
import { keys } from './internal/-state';

const {
  computed,
  assign
} = Ember;

const getters = keys.reduce((obj, key) => {
  obj[key] = computed(function() {
    return this._internal.state[key];
  }).readOnly();
  return obj;
}, {});

const state = computed(function() {
  return this._internal.state.get();
}).readOnly();

export default Ember.Mixin.create(assign({}, getters, { state }));
