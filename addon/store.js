import Ember from 'ember';
import Stores from './store/stores';
import FactoryCache from './store/factory-cache';
import InternalFactory from './store/internal-factory';
import ModelFactory from './store/model-factory';
import Databases from './store/databases';

export default Ember.Object.extend(
  Stores,
  FactoryCache,
  InternalFactory,
  ModelFactory,
  Databases
);
