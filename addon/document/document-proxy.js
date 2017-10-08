import Ember from 'ember';
import ProxyStateMixin from './-proxy-state-mixin';
import { property, promise } from './-properties';

const {
  computed
} = Ember;

const database = property('database');

const content = () => computed({
  get() {
    return this._internal.content(true);
  }
}).readOnly();

export default Ember.ObjectProxy.extend(ProxyStateMixin, {

  _internal: null,

  database: database(),

  content: content(),

  load:   promise('scheduleLoad'),
  reload: promise('scheduleReload')

});
