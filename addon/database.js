import Ember from 'ember';
import Store from './database/store';
import InternalDocumentIdentity from './database/internal-document-identity';
import InternalDocumentFactory from './database/internal-document-factory';

export default Ember.Object.extend(
  Store,
  InternalDocumentIdentity,
  InternalDocumentFactory, {

  _didDestroyModelForInternalDocument(internal) {
    if(!internal.isNew) {
      return;
    }
    this._unstoreNewInternalDocument(internal);
  },

  doc(values) {
    let internal = this._createNewInternalDocument(values);
    return internal.model(true);
  },

  existing(id, opts) {
    let internal = this._existingInternalDocument(id, opts);
    if(!internal) {
      return;
    }
    return internal.model(true);
  },

  array(values) {
    let internal = this._createInternalArray(values);
    return internal.model(true);
  },

  object(values) {
    let internal = this._createInternalObject(values);
    return internal.model(true);
  }

});
