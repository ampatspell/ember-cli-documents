import Ember from 'ember';
import ProxyMixin from './-proxy-mixin';
import { ForwardStateMixin } from './query-loader';

const {
  computed: { reads }
} = Ember;

export default Ember.ObjectProxy.extend(ProxyMixin, ForwardStateMixin, {

  content: reads('filter.value').readOnly()

});
