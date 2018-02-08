import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';

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

  return Mixin.create(assign({}, getters, { state }));
};
