import Service from '@ember/service';
import StoresStore from './stores/store';
import StoresDocumentsIdentity from './stores/documents-identity';
import StoresModelsIdentity from './stores/models-identity';

export default Service.extend(
  StoresStore,
  StoresDocumentsIdentity,
  StoresModelsIdentity
);
