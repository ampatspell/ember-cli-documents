import Ember from 'ember';
import DatabaseStore from './database/store';
import DatabaseSecurity from './database/security';
import DatabaseInternalIdentity from './database/internal-identity';
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
import DatabaseIdentity from './database/identity';
import DatabaseModels from './database/models';

export default Ember.Object.extend(
  DatabaseStore,
  DatabaseSecurity,
  DatabaseInternalIdentity,
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
  DatabaseIdentity,
  DatabaseModels
);
