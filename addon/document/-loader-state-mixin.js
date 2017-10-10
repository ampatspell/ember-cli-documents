import Ember from 'ember';
import { keys } from './internal/-loader-state';
import create from './-create-state-mixin';

const {
  computed: { reads }
} = Ember;

export const makeForwardStateMixin = target => {
  const forward = key => reads(`${target}.${key}`).readOnly();
  let props = {
    state: forward('state'),
  };
  keys.forEach(key => props[key] = forward(key));
  return Ember.Mixin.create(props);
};

export default create(keys, '_state');
