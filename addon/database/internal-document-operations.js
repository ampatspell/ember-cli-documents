import Ember from 'ember';
import Operation from './-operation';
import DocumentsError from '../util/error';

const {
  assign,
  RSVP: { reject }
} = Ember;

export default Ember.Mixin.create({

  _scheduleInternalOperation(label, internal, props, fn) {
    let op = new Operation(label, assign({ internal }, props), fn);
    return internal.addOperation(op);
  },

  //

  _isNotFoundDeleted(err) {
    return err.error === 'not_found' && err.reason === 'deleted';
  },

  _isNotFoundMissing(err) {
    return err.error === 'not_found' && err.reason === 'missing';
  },

  _isNotFoundMissingOrDeleted(err) {
    return this._isNotFoundMissing(err) || this._isNotFoundDeleted(err);
  },

  //

  _deserializeAndStoreDeletedInternal(internal, json) {
    internal.withPropertyChanges(changed => {
      if(json) {
        internal.deserializeDeleted(json, changed);
      }
      internal.state.onDeleted(changed);
    }, true);
    this._storeDeletedInternalDocument(internal);
  },

  _deserializeAndStoreDeletedInternalIfNecessary(internal, err) {
    if(!this._isNotFoundMissingOrDeleted(err)) {
      return false;
    }
    this._deserializeAndStoreDeletedInternal(internal, null);
    return true;
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

  //

  _internalWillSave(internal) {
    this._validateInternalDocumentUniqueness(internal);
    internal.withPropertyChanges(changed => {
      internal.state.onSaving(changed);
    }, true);
    return internal.serialize('document');
  },

  _internalDidSave(internal, json) {
    internal.withPropertyChanges(changed => {
      internal.deserializeSaved(json, changed);
      internal.state.onSaved(changed);
    }, true);
    this._storeSavedInternalDocument(internal);
    return internal;
  },

  _internalSaveDidFail(internal, err) {
    internal.withPropertyChanges(changed => {
      internal.state.onError(err, changed);
    }, true);
    return reject(err);
  },

  _performInternalSave(internal) {
    let state = internal.state;
    if(!state.isNew && !state.isDirty) {
      return;
    }

    let doc = this._internalWillSave(internal);

    return this.get('documents').save(doc).then(json => {
      return this._internalDidSave(internal, json);
    }, err => {
      return this._internalSaveDidFail(internal, err);
    });
  },

  //

  _internalWillDelete(internal) {
    internal.withPropertyChanges(changed => {
      internal.state.onDeleting(changed);
    }, true);
    return internal.getIdRev();
  },

  _internalDidDelete(internal, json) {
    this._deserializeAndStoreDeletedInternal(internal, json);
    return internal;
  },

  _internalDeleteDidFail(internal, err) {
    if(!this._deserializeAndStoreDeletedInternalIfNecessary(internal, err)) {
      internal.withPropertyChanges(changed => {
        this.state.onError(err, changed);
      }, true);
    }
    return reject(err);
  },

  _performInternalDelete(internal) {
    let state = internal.state;

    if(state.isNew) {
      throw new DocumentsError({ error: 'not_saved', reason: 'Document is not yet saved' });
    }

    if(state.isDeleted) {
      throw new DocumentsError({ error: 'deleted', reason: 'Document is already deleted' });
    }

    let { id, rev } = this._internalWillDelete(internal);

    return this.get('documents').delete(id, rev).then(json => {
      return this._internalDidDelete(internal, json);
    }, err => {
      return this._internalDeleteDidFail(internal, err);
    });
  },

  //

  _internalWillLoad(internal) {
    internal.withPropertyChanges(changed => {
      internal.state.onLoading(changed);
    }, true);
    return internal.getId();
  },

  _internalDidLoad(internal, json) {
    return this._deserializeDocumentForInternal(internal, json);
  },

  _internalLoadDidFail(internal, err) {
    if(!this._deserializeAndStoreDeletedInternalIfNecessary(internal, err)) {
      internal.withPropertyChanges(changed => {
        internal.state.onError(err, changed);
      }, true);
    }
    return reject(err);
  },

  __performInternalLoad(internal) {
    let id = this._internalWillLoad(internal);
    return this.get('documents').load(id).then(json => {
      return this._internalDidLoad(internal, json);
    }, err => {
      return this._internalLoadDidFail(internal, err);
    });
  },

  _performInternalLoad(internal, opts) {
    let state = internal.state;

    if(state.isLoaded && opts.force !== true) {
      return;
    }

    if(state.isNew) {
      return;
    }

    return this.__performInternalLoad(internal, opts);
  },

  _performInternalReload(internal, opts) {
    if(internal.state.isNew) {
      return;
    }
    return this.__performInternalLoad(internal, opts);
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
      return this._performInternalReload(internal, opts);
    });
  }

});
