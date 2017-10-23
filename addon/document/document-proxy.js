import Ember from 'ember';
import QueryProxyMixin from './-query-proxy-mixin';

const {
  computed: { reads }
} = Ember;

export default Ember.ObjectProxy.extend(QueryProxyMixin, {

  content: reads('filter.value').readOnly()

});
