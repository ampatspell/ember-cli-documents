import Ember from 'ember';
import StoreStores from './store/stores';
import StoreFactoryCache from './store/factory-cache';
import StoreSession from './store/session';
import StoreInternalFactory from './store/internal-factory';
import StoreModelFactory from './store/model-factory';
import StoreDatabases from './store/databases';
import StoreDocuments from './store/documents';

export default Ember.Object.extend(
  StoreStores,
  StoreFactoryCache,
  StoreSession,
  StoreInternalFactory,
  StoreModelFactory,
  StoreDatabases,
  StoreDocuments
);
