import Ember from 'ember';
import ProxyMixin, { loader } from './-proxy-mixin';
import { ForwardStateMixin } from './query-loader';

export default Ember.ArrayProxy.extend(ProxyMixin, ForwardStateMixin, {

  all: null,

  loadMore: loader('loadMore')

});
