import makeIdentityMixin from './-make-identity-mixin';

class StoresDocumentsIdentityInternal {

  constructor(stores) {
    this.stores = stores;
  }

  _modelWillDestroy() {
  }

}

export default makeIdentityMixin({
  key: 'documentsIdentity',
  factory: 'documents-identity',
  createInternal() {
    return new StoresDocumentsIdentityInternal(this);
  }
});
