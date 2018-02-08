import EmberObject from '@ember/object';
import StoresStore from './stores/store';
import StoresDocumentsIdentity from './stores/documents-identity';
import StoresFactoryCache from './stores/factory-cache';
import StoresInternalFactory from './stores/internal-factory';
import StoresId from './stores/id';

export default EmberObject.extend(
  StoresStore,
  StoresDocumentsIdentity,
  StoresFactoryCache,
  StoresInternalFactory,
  StoresId
);
