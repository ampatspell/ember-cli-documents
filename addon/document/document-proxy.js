import Ember from 'ember';
import ProxyStateMixin from './-proxy-state-mixin';

export default Ember.ObjectProxy.extend(ProxyStateMixin, {

  _internal: null,

});
