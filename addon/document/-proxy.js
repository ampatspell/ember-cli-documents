import Ember from 'ember';
import { property } from './-properties';
import { makeForwardStateMixin } from './-create-loader-state-mixin';
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

export default (Class, loaderKeys, loaderMapping) => {
  const ForwardStateMixin = makeForwardStateMixin('loader', loaderKeys);

  let props = {

    _internal: null,

    database: database(),

    filter: model('filter'),
    loader: model('loader'),

    load:   loader('load'),
    reload: loader('reload')

  };

  if(loaderMapping) {
    for(let key in loaderMapping) {
      props[key] = loader(loaderMapping[key]);
    }
  }

  return Class.extend(ForwardStateMixin, ModelMixin, props);
}
