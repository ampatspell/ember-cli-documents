import makeIdentityMixin from './-make-identity-mixin';

export default makeIdentityMixin({
  key: 'documentsIdentity',
  factory: 'documents-identity',
  createInternal() {
    return {
      stores: this
    };
  }
});
