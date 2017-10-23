import Ember from 'ember';
import ProxyMixin from './-proxy-mixin';
import { ForwardStateMixin } from './query-loader';

export default Ember.ArrayProxy.extend(ProxyMixin, ForwardStateMixin);
