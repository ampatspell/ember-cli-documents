import Ember from 'ember';
// import createTransform from './mixins/create-array-transform-mixin';

// const Transform = createTransform({
//   internal(model) {
//     return this._internal.internalFromModel(model);
//   },
//   public(internal) {
//     return this._internal.modelFromInternal(internal);
//   }
// });

export default Ember.ArrayProxy.extend({

  _internal: null

});
