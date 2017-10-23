import Ember from 'ember';
import ProxyMixin, { loader } from './-proxy-mixin';
import { keys } from './paginated-loader';
import { makeForwardStateMixin } from './-create-loader-state-mixin';

const ForwardStateMixin = makeForwardStateMixin('loader', keys);

export default Ember.ArrayProxy.extend(ProxyMixin, ForwardStateMixin, {

  all: null,

  loadMore: loader('loadMore')

});
