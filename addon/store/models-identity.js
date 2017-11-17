import makeIdentityMixin from './-make-identity-mixin';

export default makeIdentityMixin({
  key: 'modelsIdentity',
  factory: 'store/models-identity',
  content() {
    return this._models.all;
  }
});
