import Ember from 'ember';
import StoreStores from './store/stores';
import StoreFactoryCache from './store/factory-cache';
import StoreInternalFactory from './store/internal-factory';
import StoreModelFactory from './store/model-factory';
import StoreDatabases from './store/databases';

export default Ember.Object.extend(
  StoreStores,
  StoreFactoryCache,
  StoreInternalFactory,
  StoreModelFactory,
  StoreDatabases
);
