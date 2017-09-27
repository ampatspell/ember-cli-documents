import Ember from 'ember';
import InternalDocumentSaveOperation from './operations/internal/save';
import InternalDocumentLoadOperation from './operations/internal/load';
import InternalDocumentReloadOperation from './operations/internal/reload';
import InternalDocumentDeleteOperation from './operations/internal/delete';

const internalOperation = (Class) => function(internal, ...args) {
  let op = new Class(internal, ...args);
  return this._scheduleInternalOperation(internal, op);
};

export default Ember.Mixin.create({

  _scheduleInternalOperation(internal, op) {
    return internal.addOperation(op);
  },

  _scheduleInternalSave:   internalOperation(InternalDocumentSaveOperation),
  _scheduleInternalLoad:   internalOperation(InternalDocumentLoadOperation),
  _scheduleInternalReload: internalOperation(InternalDocumentReloadOperation),
  _scheduleInternalDelete: internalOperation(InternalDocumentDeleteOperation)

});
