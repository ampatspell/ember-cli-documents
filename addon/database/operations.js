import Ember from 'ember';
import InternalDocumentSaveOperation from './operations/internal/save';
import InternalDocumentLoadOperation from './operations/internal/load';

export default Ember.Mixin.create({

  _enqueueInternalOperation(op) {
    // internal.addOperation(op);
    op.invoke();
    return op.promise;
  },

  _enqueueInternalSave(internal) {
    let op = new InternalDocumentSaveOperation(internal);
    return this._enqueueInternalOperation(op);
  },

  _enqueueInternalLoad(internal) {
    let op = new InternalDocumentLoadOperation(internal);
    return this._enqueueInternalOperation(op);
  },

  _enqueueInternalReload() {

  },

  _enqueueInternalDelete() {

  },

});
