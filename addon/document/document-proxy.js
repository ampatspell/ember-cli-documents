import Ember from 'ember';
import { property } from './-properties';
import { makeForwardStateMixin } from './-loader-state-mixin';

const {
  computed,
  computed: { reads }
} = Ember;

const database = property('database');

const model = name => computed(function() {
  let internal = this._internal;
  return internal[name].call(internal, true).model(true);
}).readOnly();

const loader = name => function(...args) {
  let loader = this.get('loader');
  return loader[name].call(loader, ...args);
};

const ForwardStateMixin = makeForwardStateMixin('loader');

export default Ember.ObjectProxy.extend(ForwardStateMixin, {

  _internal: null,

  content: reads('filter.value').readOnly(),

  database: database(),

  filter: model('filter'),
  loader: model('loader'),

  load:   loader('load'),
  reload: loader('reload'),

});
