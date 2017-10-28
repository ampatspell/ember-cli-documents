import Ember from 'ember';
import create from './-create-state-mixin';

const {
  computed: { reads }
} = Ember;

export const createForwardStateMixin = (target, keys) => {
  const forward = key => reads(`${target}.${key}`).readOnly();
  let props = {
    state: forward('state')
  };
  keys.forEach(key => props[key] = forward(key));
  return Ember.Mixin.create(props);
};

export const createLoaderStateMixin = keys => create(keys, '_stateProp');
