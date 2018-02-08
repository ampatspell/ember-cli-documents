import EmberObject from '@ember/object';
import DatabaseStore from './database/store';
import DatabaseSecurity from './database/security';
import DatabaseInternalDocumentsIdentity from './database/internal-documents-identity';
import DatabaseInternalFactory from './database/internal-factory';
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

export default EmberObject.extend(
  DatabaseStore,
  DatabaseSecurity,
  DatabaseInternalDocumentsIdentity,
  DatabaseInternalFactory,
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
  DatabaseDocumentsIdentity
);
