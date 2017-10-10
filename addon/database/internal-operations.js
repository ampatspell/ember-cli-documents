import Ember from 'ember';
import Operation from './-operation';
import DocumentsError from '../util/error';

const {
  merge,
  assign,
  RSVP: { resolve }
} = Ember;

export default Ember.Mixin.create({

  __scheduleInternalOperation(label, internal, props, before, resolve, reject, fn) {
    let op = new Operation(label, assign({ internal }, props), fn, before, resolve, reject);
    this._registerInternalOperation(op);
    return internal.addOperation(op);
  },

  //

  __validateInternalDocumentUniqueness(internal) {
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

  __reloadInternalAttachments(internal, json) {
    return this.get('documents').load(json.id, { rev: json.rev }).then(doc => {
      return this._deserializeInternalAttachments(internal, doc);
    });
  },

  __performInternalSave(internal, opts) {
    opts = merge({ force: false }, opts);

    let state = internal.state;
    if(!(state.isNew || state.isDeleted) && !state.isDirty && !opts.force) {
      return resolve(internal);
    }

    this.__validateInternalDocumentUniqueness(internal);

    internal.setState('onSaving');

    let doc = internal.serialize('document');
    let resume = this._suspendChanges();

    return this.get('documents').save(doc).then(json => {
      this._deserializeInternalSave(internal, json);
      if(json.reload) {
        return this.__reloadInternalAttachments(internal, json);
      }
      return internal;
    }, err => {
      return this._deserializeInternalSaveDidFail(internal, err);
    }).finally(() => {
      resume();
    });
  },

  //

  __performInternalDelete(internal) {
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
      return this.__deserializeInternalDeleteDidFail(internal, err);
    });
  },

  //

  __performInternalLoad(internal, opts) {
    let state = internal.state;

    if(state.isLoaded && opts.force !== true) {
      return resolve(internal);
    }

    if(state.isNew) {
      return resolve(internal);
    }

    internal.setState('onLoading');

    let id = internal.getId();

    return this.get('documents').load(id).then(json => {
      return this._deserializeInternalLoad(internal, json, 'document');
    }, err => {
      return this._deserializeInternalLoadDidFail(internal, err);
    });
  },

  //

  _scheduleInternalSave(internal, opts={}, before, resolve, reject) {
    return this.__scheduleInternalOperation('document-save', internal, { opts }, before, resolve, reject, () => {
      return this.__performInternalSave(internal, opts);
    });
  },

  _scheduleInternalDelete(internal, opts={}, before, resolve, reject) {
    return this.__scheduleInternalOperation('document-delete', internal, { opts }, before, resolve, reject, () => {
      return this.__performInternalDelete(internal, opts);
    });
  },

  _scheduleInternalLoad(internal, opts={}, before, resolve, reject) {
    return this.__scheduleInternalOperation('document-load', internal, { opts }, before, resolve, reject, () => {
      return this.__performInternalLoad(internal, opts);
    });
  },

  _scheduleInternalReload(internal, opts={}, before, resolve, reject) {
    return this.__scheduleInternalOperation('document-reload', internal, { opts }, before, resolve, reject, () => {
      return this.__performInternalLoad(internal, assign({}, opts, { force: true }));
    });
  }

});
