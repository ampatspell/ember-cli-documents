import Ember from 'ember';
import StoreStores from './store/stores';
import StoreFactoryCache from './store/factory-cache';
import StoreSession from './store/session';
import StoreInternalFactory from './store/internal-factory';
import StoreModelFactory from './store/model-factory';
import StoreDatabases from './store/databases';
import StoreDB from './store/db';
import StoreDocuments from './store/documents';
import StoreChanges from './store/changes';
import StoreShoebox from './store/shoebox';
import StoreFastboot from './store/fastboot';
import StoreOperations from './store/operations';
import StoreIdentity from './store/identity';

export default Ember.Object.extend(
  StoreStores,
  StoreFactoryCache,
  StoreSession,
  StoreInternalFactory,
  StoreModelFactory,
  StoreDatabases,
  StoreDB,
  StoreDocuments,
  StoreChanges,
  StoreShoebox,
  StoreFastboot,
  StoreOperations,
  StoreIdentity
);
