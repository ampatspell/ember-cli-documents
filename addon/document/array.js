import Ember from 'ember';
import BaseMixin from './base-mixin';
import mark from '../util/mark-model';

// import createTransform from './mixins/create-array-transform-mixin';

// const Transform = createTransform({
//   internal(model) {
//     return this._internal.internalFromModel(model);
//   },
//   public(internal) {
//     return this._internal.modelFromInternal(internal);
//   }
// });

export default mark(Ember.ArrayProxy.extend(BaseMixin, {
}));
