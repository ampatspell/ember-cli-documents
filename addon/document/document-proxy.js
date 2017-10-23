import Ember from 'ember';
import ProxyMixin from './-proxy-mixin';
import { keys } from './query-loader';
import { makeForwardStateMixin } from './-create-loader-state-mixin';

const {
  computed: { reads }
} = Ember;

const ForwardStateMixin = makeForwardStateMixin('loader', keys);

export default Ember.ObjectProxy.extend(ProxyMixin, ForwardStateMixin, {

  content: reads('filter.value').readOnly()

});
