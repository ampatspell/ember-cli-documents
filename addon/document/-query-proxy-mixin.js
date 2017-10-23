import Ember from 'ember';
import ProxyMixin from './-proxy-mixin';
import { keys } from './query-loader';
import { makeForwardStateMixin } from './-create-loader-state-mixin';

const {
  Mixin
} = Ember;

const ForwardStateMixin = makeForwardStateMixin('loader', keys);

export default Mixin.create(ProxyMixin, ForwardStateMixin);
