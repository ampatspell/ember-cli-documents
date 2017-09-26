import Ember from 'ember';
import InternalDocumentSaveOperation from './operations/internal/save';

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

  _enqueueInternalLoad() {

  },

  _enqueueInternalReload() {

  },

  _enqueueInternalDelete() {

  },

});
