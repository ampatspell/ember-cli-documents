import { A } from '@ember/array';
import makeIdentityMixin from './-make-identity-mixin';

export default makeIdentityMixin({
  key: 'documentsIdentity',
  factory: 'store/documents-identity',
  content() {
    return A();
  }
});
