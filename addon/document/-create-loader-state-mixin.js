import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';
import create from './-create-state-mixin';

export const createForwardStateMixin = (target, keys) => {
  const forward = key => reads(`${target}.${key}`).readOnly();
  let props = {
    state: forward('state')
  };
  keys.forEach(key => props[key] = forward(key));
  return Mixin.create(props);
};

export const createLoaderStateMixin = keys => create(keys, '_getStateProperty');
