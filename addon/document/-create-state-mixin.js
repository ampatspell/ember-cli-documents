import Ember from 'ember';

const {
  computed,
  assign
} = Ember;

export default keys => {

  const getters = keys.reduce((obj, key) => {
    obj[key] = computed(function() {
      return this._internal.state[key];
    }).readOnly();
    return obj;
  }, {});

  const state = computed(function() {
    return this._internal.state.get();
  }).readOnly();

  return Ember.Mixin.create(assign({}, getters, { state }));
};
