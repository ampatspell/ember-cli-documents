import Stores from 'documents/stores';
import Store from 'documents/store';
import Database from 'documents/database';
import Document from 'documents/document/document';
import DocumentObject from 'documents/document/object';
import DocumentArray from 'documents/document/array';
import InternalDocument from 'documents/document/internal/document';
import InternalObject from 'documents/document/internal/object';
import InternalArray from 'documents/document/internal/array';

export default {
  name: 'documents:internal',
  initialize(container) {
    container.register('documents:stores', Stores);

    container.register('documents:store', Store);
    container.register('documents:database', Database);

    container.register('documents:document', Document);
    container.register('documents:object', DocumentObject);
    container.register('documents:array', DocumentArray);

    container.register('documents:internal-document', InternalDocument);
    container.register('documents:internal-object', InternalObject);
    container.register('documents:internal-array', InternalArray);
  }
};
