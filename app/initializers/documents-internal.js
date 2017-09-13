import Database from 'documents/database';
import Document from 'documents/document/document';
import DocumentObject from 'documents/document/object';
import InternalDocument from 'documents/document/internal/internal-document';
import InternalObject from 'documents/document/internal/internal-object';

export default {
  name: 'documents:internal',
  initialize(container) {
    container.register('documents:database', Database);

    container.register('documents:document', Document);
    container.register('documents:object', DocumentObject);

    container.register('documents:internal-document', InternalDocument);
    container.register('documents:internal-object', InternalObject);
  }
};
