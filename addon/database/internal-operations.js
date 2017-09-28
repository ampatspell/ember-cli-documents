import Ember from 'ember';
import Operation from './-operation';
import DocumentsError from '../util/error';

const {
  assign,
} = Ember;

export default Ember.Mixin.create({

  _scheduleInternalOperation(label, internal, props, fn) {
    let op = new Operation(label, assign({ internal }, props), fn);
    return internal.addOperation(op);
  },

  //

  _validateInternalDocumentUniqueness(internal) {
    let id = internal.getId();
    let existing = this._internalDocumentWithId(id);
    if(!existing || existing === internal) {
      return;
    }
    throw new DocumentsError({
      error: 'conflict',
      reason: 'Document update conflict'
    });
  },

  _performInternalSave(internal) {
    let state = internal.state;

    if(!(state.isNew || state.isDeleted) && !state.isDirty) {
      return;
    }

    this._validateInternalDocumentUniqueness(internal);

    internal.setState('onSaving');

    let doc = internal.serialize('document');

    return this.get('documents').save(doc).then(json => {
      return this._deserializeInternalSave(internal, json);
    }, err => {
      return this._deserializeInternalSaveDidFail(internal, err);
    });
  },

  //

  _performInternalDelete(internal) {
    let state = internal.state;

    if(state.isNew) {
      throw new DocumentsError({ error: 'not_saved', reason: 'Document is not yet saved' });
    }

    if(state.isDeleted) {
      throw new DocumentsError({ error: 'deleted', reason: 'Document is already deleted' });
    }

    internal.setState('onDeleting');

    let { id, rev } = internal.getIdRev();

    return this.get('documents').delete(id, rev).then(json => {
      return this._deserializeInternalDelete(internal, json);
    }, err => {
      return this._deserializeInternalDeleteDidFail(internal, err);
    });
  },

  //

  _performInternalLoad(internal, opts) {
    let state = internal.state;

    if(state.isLoaded && opts.force !== true) {
      return;
    }

    if(state.isNew) {
      return;
    }

    internal.setState('onLoading');

    let id = internal.getId();

    return this.get('documents').load(id).then(json => {
      return this._deserializeInternalLoad(internal, json);
    }, err => {
      return this._deserializeInternalLoadDidFail(internal, err);
    });
  },

  //

  _scheduleInternalSave(internal, opts={}) {
    return this._scheduleInternalOperation('document-save', internal, { opts }, () => {
      return this._performInternalSave(internal, opts);
    });
  },

  _scheduleInternalDelete(internal, opts={}) {
    return this._scheduleInternalOperation('document-delete', internal, { opts }, () => {
      return this._performInternalDelete(internal, opts);
    });
  },

  _scheduleInternalLoad(internal, opts={}) {
    return this._scheduleInternalOperation('document-load', internal, { opts }, () => {
      return this._performInternalLoad(internal, opts);
    });
  },

  _scheduleInternalReload(internal, opts={}) {
    return this._scheduleInternalOperation('document-reload', internal, { opts }, () => {
      return this._performInternalLoad(internal, assign({}, opts, { force: true }));
    });
  }

});
