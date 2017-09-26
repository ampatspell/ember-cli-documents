import Ember from 'ember';
import InternalDocumentSaveOperation from './operations/internal/save';
import InternalDocumentLoadOperation from './operations/internal/load';
import InternalDocumentReloadOperation from './operations/internal/reload';
import InternalDocumentDeleteOperation from './operations/internal/delete';

export default Ember.Mixin.create({

  _enqueueInternalOperation(op) {
    // internal.addOperation(op);
    op.invoke();
    return op.promise;
  },

  _enqueueInternalSave(internal, opts) {
    let op = new InternalDocumentSaveOperation(internal, opts);
    return this._enqueueInternalOperation(op);
  },

  _enqueueInternalLoad(internal, opts) {
    let op = new InternalDocumentLoadOperation(internal, opts);
    return this._enqueueInternalOperation(op);
  },

  _enqueueInternalReload(internal, opts) {
    let op = new InternalDocumentReloadOperation(internal, opts);
    return this._enqueueInternalOperation(op);
  },

  _enqueueInternalDelete() {
    let op = new InternalDocumentDeleteOperation(internal);
    return this._enqueueInternalOperation(op);
  },

});
