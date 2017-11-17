import Ember from 'ember';
import StoreStores from './store/stores';
import StoreFactoryCache from './store/factory-cache';
import StoreSession from './store/session';
import StoreInternalFactory from './store/internal-factory';
import StoreModelFactory from './store/model-factory';
import StoreInternalModelsIdentity from './store/internal-models-identity';
import StoreDatabases from './store/databases';
import StoreDB from './store/db';
import StoreDocuments from './store/documents';
import StoreChanges from './store/changes';
import StoreShoebox from './store/shoebox';
import StoreFastboot from './store/fastboot';
import StoreOperations from './store/operations';
import StoreDocumentsIdentity from './store/documents-identity';
import StoreModelsIdentity from './store/models-identity';
import StoreModels from './store/models';

export default Ember.Object.extend(
  StoreStores,
  StoreFactoryCache,
  StoreSession,
  StoreInternalFactory,
  StoreInternalModelsIdentity,
  StoreModelFactory,
  StoreDatabases,
  StoreDB,
  StoreDocuments,
  StoreChanges,
  StoreShoebox,
  StoreFastboot,
  StoreOperations,
  StoreDocumentsIdentity,
  StoreModelsIdentity,
  StoreModels
);
