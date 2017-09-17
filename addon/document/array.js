import Ember from 'ember';
import BaseMixin from './base-mixin';
import { markModel } from '../util/internal';

// import createTransform from './mixins/create-array-transform-mixin';

// const Transform = createTransform({
//   internal(model) {
//     return this._internal.internalFromModel(model);
//   },
//   public(internal) {
//     return this._internal.modelFromInternal(internal);
//   }
// });

export default markModel(Ember.ArrayProxy.extend(BaseMixin, {
}));
