import Ember from 'ember';
import makeIdentityMixin from './-make-identity-mixin';

const {
  A
} = Ember;

export default makeIdentityMixin({
  key: 'documentsIdentity',
  factory: 'store/documents-identity',
  content() {
    return A();
  }
});
