import Ember from 'ember';

const {
  computed
} = Ember;

export const forward = (key, getter, setter) => () => {
  let props = {};
  props.get = function() {
    let internal = this._internal;
    return internal[getter].call(internal);
  }
  if(setter) {
    props.set = function(_, value) {
      let internal = this._internal;
      return internal[setter].call(internal, value);
    };
  }
  let args = [];
  if(key) {
    args.push(key);
  }
  args.push(props);
  return computed(...args);
};

export const property = name => () => {
  return computed(function() {
    return this._internal[name];
  }).readOnly();
};

export const promise = name => function() {
  let internal = this._internal;
  return internal[name].call(internal, ...arguments).then(() => this);
};
