import Ember from 'ember';

const {
  computed
} = Ember;

export const forward = (getter, setter) => () => {
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
  args.push(props);
  let prop = computed(...args);
  if(!setter) {
    prop = prop.readOnly();
  }
  return prop;
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
