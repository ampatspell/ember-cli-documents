import Ember from 'ember';
import QueryProxyMixin from './-query-proxy-mixin';

export default Ember.ArrayProxy.extend(QueryProxyMixin);
