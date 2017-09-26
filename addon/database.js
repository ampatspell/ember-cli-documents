import Ember from 'ember';
import DatabaseStore from './database/store';
import DatabaseInternalDocumentIdentity from './database/internal-document-identity';
import DatabaseInternalDocumentFactory from './database/internal-document-factory';
import DatabaseInternalDocumentDeserialize from './database/internal-document-deserialize';
import DatabaseDocument from './database/document';

export default Ember.Object.extend(
  DatabaseStore,
  DatabaseInternalDocumentIdentity,
  DatabaseInternalDocumentFactory,
  DatabaseInternalDocumentDeserialize,
  DatabaseDocument, {

});
