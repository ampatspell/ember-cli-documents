import Ember from 'ember';
import EmptyObject from '../util/empty-object';

const {
  on,
  A
} = Ember;

export default Ember.Mixin.create({

  _createModelIdentity: on('init', function() {
    this._documents = new EmptyObject();
    this._documents.all = A([]);                 // all new and saved models
    this._documents.new = A([]);                 // new models
    this._documents.saved = new EmptyObject();   // all saved
    this._documents.deleted = new EmptyObject(); // all deleted
  }),

  _storeNewInternalDocument(internal) {
    let documents = this._documents;
    documents.new.addObject(internal);
    documents.all.addObject(internal);
  },

  _unstoreNewInternalDocument(internal) {
    let documents = this._documents;
    documents.new.removeObject(internal);
    documents.all.removeObject(internal);
  },

  _storeSavedInternalDocument(internal) {
    let documents = this._documents;
    let id = internal.getId();
    documents.saved[id] = internal;
    delete documents.deleted[id];
    documents.all.addObject(internal);
    documents.new.removeObject(internal);
  },

  _storeLoadedInternalDocument(internal) {
    this._storeSavedInternalDocument(internal);
  },

  _storeDeletedInternalDocument(internal) {
    let documents = this._documents;
    let id = internal.getId();
    delete documents.saved[id];
    documents.deleted[id] = internal;
    documents.all.removeObject(internal);
    documents.new.removeObject(internal);
  },

  // lookup

  _internalDocumentWithId(id, includingDeleted=false) {
    let documents = this._documents;
    let internal = documents.saved[id];
    if(!internal && includingDeleted) {
      internal = documents.deleted[id];
    }
    return internal;
  }

});
