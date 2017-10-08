import Ember from 'ember';
import ProxyStateMixin from './-proxy-state-mixin';
import { property, promise } from './-properties';

const {
  computed,
  computed: { reads }
} = Ember;

const database = property('database');

const filter = () => computed(function() {
  return this._internal.filter.model(true);
}).readOnly();

export default Ember.ObjectProxy.extend(ProxyStateMixin, {

  _internal: null,

  database: database(),
  filter: filter(),

  content: reads('filter.value').readOnly(),

  load:   promise('scheduleLoad'),
  reload: promise('scheduleReload')

});
