import Service from '@ember/service';
import StoresStore from './stores/store';
import StoresDocumentsIdentity from './stores/documents-identity';
import StoresModelsIdentity from './stores/models-identity';
import StoresFactoryCache from './stores/factory-cache';
import StoresInternalFactory from './stores/internal-factory';
import StoresInternalModelsIdentity from './stores/internal-models-identity';
import StoresModel from './stores/model';
import StoresId from './stores/id';

export default Service.extend(
  StoresStore,
  StoresDocumentsIdentity,
  StoresModelsIdentity,
  StoresFactoryCache,
  StoresInternalFactory,
  StoresInternalModelsIdentity,
  StoresModel,
  StoresId
);
