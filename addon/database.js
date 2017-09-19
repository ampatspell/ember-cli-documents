import Ember from 'ember';
import Store from './database/store';
import InternalDocumentIdentity from './database/internal-document-identity';
import InternalDocumentFactory from './database/internal-document-factory';
import Document from './database/document';

export default Ember.Object.extend(
  Store,
  InternalDocumentIdentity,
  InternalDocumentFactory,
  Document, {

  _didDestroyModelForInternalDocument(internal) {
    if(!internal.isNew) {
      return;
    }
    this._unstoreNewInternalDocument(internal);
  }

});
