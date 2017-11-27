import { isObject } from './assert';
import { assign } from '@ember/polyfills';

export default (opts, hash) => {
  isObject('opts', opts);
  let { props } = opts;
  props = assign(hash, props);
  return assign(opts, { props });
}
