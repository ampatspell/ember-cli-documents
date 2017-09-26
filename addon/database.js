import Ember from 'ember';
import DatabaseStore from './database/store';
import DatabaseInternalDocumentIdentity from './database/internal-document-identity';
import DatabaseInternalDocumentFactory from './database/internal-document-factory';
import DatabaseInternalDocumentDeserialize from './database/internal-document-deserialize';
import DatabaseDocument from './database/document';
import DatabaseOperations from './database/operations';
import DatabaseDocuments from './database/documents';

export default Ember.Object.extend(
  DatabaseStore,
  DatabaseInternalDocumentIdentity,
  DatabaseInternalDocumentFactory,
  DatabaseInternalDocumentDeserialize,
  DatabaseOperations,
  DatabaseDocument,
  DatabaseDocuments
);
