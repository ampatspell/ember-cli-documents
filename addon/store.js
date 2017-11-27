import EmberObject from '@ember/object';
import StoreStores from './store/stores';
import StoreFactoryCache from './store/factory-cache';
import StoreSession from './store/session';
import StoreInternalFactory from './store/internal-factory';
import StoreModelFactory from './store/model-factory';
import StoreDatabases from './store/databases';
import StoreId from './store/id';
import StoreDocuments from './store/documents';
import StoreChanges from './store/changes';
import StoreShoebox from './store/shoebox';
import StoreFastboot from './store/fastboot';
import StoreOperations from './store/operations';
import StoreDocumentsIdentity from './store/documents-identity';
import StoreModels from './store/models';

export default EmberObject.extend(
  StoreStores,
  StoreFactoryCache,
  StoreSession,
  StoreInternalFactory,
  StoreModelFactory,
  StoreDatabases,
  StoreId,
  StoreDocuments,
  StoreChanges,
  StoreShoebox,
  StoreFastboot,
  StoreOperations,
  StoreDocumentsIdentity,
  StoreModels
);
