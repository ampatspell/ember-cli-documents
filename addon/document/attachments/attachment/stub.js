import Ember from 'ember';
import Content from './-base';
import { mapping } from './internal/stub';

const {
  assign,
  computed
} = Ember;

const prop = key => computed(function() {
  return this._internal.props[key];
}).readOnly();

let props = {};

for(let key in mapping) {
  let value = mapping[key];
  props[key] = prop(value);
}

export default Content.extend(assign(props, {
}));
