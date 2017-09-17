import Ember from 'ember';
import BaseMixin from './base-mixin';
import { markModel } from 'documents/util/internal';
import createTransform from 'documents/util/create-array-transform-mixin';

const TransformMixin = createTransform({
  internal(model) {
    return this._internal._toInternal(model);
  },
  public(internal) {
    return this._internal._toModel(internal);
  }
});

export default markModel(Ember.ArrayProxy.extend(BaseMixin, TransformMixin));
