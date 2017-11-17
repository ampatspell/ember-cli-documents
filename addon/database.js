import Ember from 'ember';
import DatabaseStore from './database/store';
import DatabaseSecurity from './database/security';
import DatabaseInternalDocumentsIdentity from './database/internal-documents-identity';
import DatabaseInternalFactory from './database/internal-factory';
import DatabaseInternalProxyFactory from './database/internal-proxy-factory';
import DatabaseInternalDeserialize from './database/internal-deserialize';
import DatabaseInternalOperations from './database/internal-operations';
import DatabaseInternalFind from './database/internal-find';
import DatabaseDocument from './database/document';
import DatabaseDocuments from './database/documents';
import DatabaseDocumentFind from './database/document-find';
import DatabaseProxy from './database/proxy';
import DatabaseChanges from './database/changes';
import DatabaseShoebox from './database/shoebox';
import DatabaseOperation from './database/operations';
import DatabaseDocumentsIdentity from './database/documents-identity';
import DatabaseModels from './database/models';

export default Ember.Object.extend(
  DatabaseStore,
  DatabaseSecurity,
  DatabaseInternalDocumentsIdentity,
  DatabaseInternalFactory,
  DatabaseInternalProxyFactory,
  DatabaseInternalDeserialize,
  DatabaseInternalOperations,
  DatabaseInternalFind,
  DatabaseProxy,
  DatabaseDocument,
  DatabaseDocuments,
  DatabaseDocumentFind,
  DatabaseChanges,
  DatabaseShoebox,
  DatabaseOperation,
  DatabaseDocumentsIdentity,
  DatabaseModels
);
