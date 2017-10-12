import Ember from 'ember';
import { property } from './-properties';
import { makeForwardStateMixin } from './-loader-state-mixin';
import ModelMixin from './-model-mixin';

const {
  computed
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

export default Class => Class.extend(ForwardStateMixin, ModelMixin, {

  _internal: null,

  database: database(),

  filter: model('filter'),
  loader: model('loader'),

  load:   loader('load'),
  reload: loader('reload')

});
