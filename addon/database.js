import Ember from 'ember';
import InternalFactory from './database/internal-factory';
import InternalDocumentIdentity from './database/internal-document-identity';
import DocumentPush from './database/document-push';
import DocumentExisting from './database/document-existing';

export default Ember.Object.extend(
  InternalFactory,
  InternalDocumentIdentity,
  DocumentPush,
  DocumentExisting
);
