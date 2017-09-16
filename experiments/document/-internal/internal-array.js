import Ember from 'ember';
import ModelMixin from './mixins/model';
import NestedMixin from './mixins/nested';
import isInternal, { markInternal } from './is-internal';

const {
  merge,
  A
} = Ember;

export default markInternal('array', Ember.Object.extend(ModelMixin, NestedMixin, {

  _values: null,

  values() {
    let values = this._values;
    if(!values) {
      values = A();
      this._values = values;
    }
    return values;
  },

  _modelFactory(owner) {
    return owner.factoryFor('documents:array');
  },

  _createModelProperties() {
    let content = this.values();
    return { content };
  },

  internalFromModel(model) {
    if(!model) {
      return;
    }
    let internal = model._internal;
    if(isInternal(internal)) {
      return internal;
    }
    return model;
  },

  modelFromInternal(internal) {
    if(isInternal(internal)) {
      return internal.model(true);
    }
    return internal;
  },

  deserialize(doc, opts) {
  },

  serialize(opts) {
    opts = merge({ type: 'document' }, opts);

    let values = this.values();
    let array = values.map(value => this._serialize(value, opts));

    if(opts.type === 'preview') {
      let object = {};
      object._internal = `${Ember.meta(this).factory.fullName}:${Ember.guidFor(this)}`;
      object.content = array;
      return object;
    }

    return array;
  }

}));
