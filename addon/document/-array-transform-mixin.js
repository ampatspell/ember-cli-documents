import createTransform from 'documents/util/create-array-transform-mixin';

export default createTransform({
  internal(model) {
    return this._internal.toInternal(model);
  },
  public(internal) {
    return this._internal.toModel(internal);
  }
});
