import Ember from 'ember';
import { property } from './-properties';
import ModelMixin from './-model-mixin';

const {
  Mixin,
  computed
} = Ember;

const model = name => computed(function() {
  let internal = this._internal;
  return internal[name].call(internal, true).model(true);
}).readOnly();

export const loader = name => function(...args) {
  let loader = this.get('loader');
  return loader[name].call(loader, ...args).then(() => this);
};

const database = property('database');

export default Mixin.create(ModelMixin, {

  database: database(),

  filter: model('filter'),
  loader: model('loader'),

  load:   loader('load'),
  reload: loader('reload')

});
