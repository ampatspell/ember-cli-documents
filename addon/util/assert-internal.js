import Ember from 'ember';
import isInternal from './is-internal';

const {
  assert
} = Ember;

export default (name, arg) => assert(`${name} must be internal object`, this._isInternal(arg));
