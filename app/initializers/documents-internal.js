import Database from 'documents/database';
import Document from 'documents/document';
import InternalDocument from 'documents/internal-document';

export default {
  name: 'documents:internal',
  initialize(container) {
    container.register('documents:database', Database);
    container.register('documents:document', Document);
    container.register('documents:internal-document', InternalDocument);
  }
};
