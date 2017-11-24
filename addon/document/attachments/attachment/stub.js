import { assign } from '@ember/polyfills';
import { computed } from '@ember/object';
import Content from './-base';
import { mapping } from './internal/stub';

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
