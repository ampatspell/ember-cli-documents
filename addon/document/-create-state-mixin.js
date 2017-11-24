import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';

export default (keys, fn) => {

  const getters = keys.reduce((obj, key) => {
    let value;
    if(fn) {
      value = function() {
        let internal = this._internal;
        return internal[fn].call(internal, key);
      }
    } else {
      value = function() {
        return this._internal.state[key];
      }
    }
    obj[key] = computed(value).readOnly();
    return obj;
  }, {});

  const state = computed(function() {
    return this._internal.state.get();
  }).readOnly();

  return Mixin.create(assign({}, getters, { state }));
};
