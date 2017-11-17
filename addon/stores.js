import Ember from 'ember';
import StoresStore from './stores/store';
import StoresDocumentsIdentity from './stores/documents-identity';
import StoresModelsIdentity from './stores/models-identity';

export default Ember.Service.extend(
  StoresStore,
  StoresDocumentsIdentity,
  StoresModelsIdentity
);
