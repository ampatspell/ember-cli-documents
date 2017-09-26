import Ember from 'ember';
import InternalDocumentSaveOperation from './operations/internal/save';
import InternalDocumentLoadOperation from './operations/internal/load';
import InternalDocumentReloadOperation from './operations/internal/reload';
import InternalDocumentDeleteOperation from './operations/internal/delete';

const internalOperation = (Class) => function() {
  let op = new Class(...arguments);
  return this._enqueueInternalOperation(op);
};

export default Ember.Mixin.create({

  _enqueueInternalOperation(op) {
    // internal.addOperation(op);
    op.invoke();
    return op.promise;
  },

  _enqueueInternalSave:   internalOperation(InternalDocumentSaveOperation),
  _enqueueInternalLoad:   internalOperation(InternalDocumentLoadOperation),
  _enqueueInternalReload: internalOperation(InternalDocumentReloadOperation),
  _enqueueInternalDelete: internalOperation(InternalDocumentDeleteOperation)

});
