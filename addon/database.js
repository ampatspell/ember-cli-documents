import Ember from 'ember';
import DatabaseStore from './database/store';
import DatabaseInternalIdentity from './database/internal-identity';
import DatabaseInternalFactory from './database/internal-factory';
import DatabaseInternalDeserialize from './database/internal-deserialize';
import DatabaseInternalOperations from './database/internal-operations';
import DatabaseInternalFind from './database/internal-find';
import DatabaseDocument from './database/document';
import DatabaseDocuments from './database/documents';
import DatabaseDocumentFind from './database/document-find';

export default Ember.Object.extend(
  DatabaseStore,
  DatabaseInternalIdentity,
  DatabaseInternalFactory,
  DatabaseInternalDeserialize,
  DatabaseInternalOperations,
  DatabaseInternalFind,
  DatabaseDocument,
  DatabaseDocuments,
  DatabaseDocumentFind
);
