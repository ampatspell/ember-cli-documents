import Ember from 'ember';
import InternalDocumentSaveOperation from './operations/internal/save';
import InternalDocumentLoadOperation from './operations/internal/load';
import InternalDocumentReloadOperation from './operations/internal/reload';
import InternalDocumentDeleteOperation from './operations/internal/delete';

const internalOperation = (Class) => function(internal, ...args) {
  let op = new Class(internal, ...args);
  return this._enqueueInternalOperation(internal, op);
};

export default Ember.Mixin.create({

  _enqueueInternalOperation(internal, op) {
    return internal.addOperation(op);
  },

  _enqueueInternalSave:   internalOperation(InternalDocumentSaveOperation),
  _enqueueInternalLoad:   internalOperation(InternalDocumentLoadOperation),
  _enqueueInternalReload: internalOperation(InternalDocumentReloadOperation),
  _enqueueInternalDelete: internalOperation(InternalDocumentDeleteOperation)

});
