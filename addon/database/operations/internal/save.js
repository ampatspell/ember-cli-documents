import Ember from 'ember';
import Operation from './operation';
import DocumentsError from 'documents/util/error';

const {
  RSVP: { resolve, reject },
} = Ember;

export default class InternalDocumentSaveOperation extends Operation {

  validateUniqueness() {
    let internal = this.internal;
    let id = internal.getId();
    let existing = this.db._internalDocumentWithId(id);
    if(!existing || existing === internal) {
      return;
    }
    return reject(new DocumentsError({
      error: 'conflict',
      reason: 'Document update conflict'
    }));
  }

  willSave() {
    this.withPropertyChanges(changed => this.state.onSaving(changed));
    return this.internal.serialize('document');
  }

  save(doc) {
    return this.docs.save(doc);
  }

  didSave(json) {
    this.withPropertyChanges(changed => {
      this.internal.deserializeSaved(json, changed);
      this.state.onSaved(changed);
    });
    this.db._storeSavedInternalDocument(this.internal);
    this.resolve();
  }

  saveDidFail(err) {
    this.withPropertyChanges(changed => {
      this.state.onError(err, changed);
    });
    this.reject(err);
  }

  invoke() {
    if(!this.state.isNew && !this.state.isDirty) {
      return this.resolve();
    }
    return resolve()
      .then(() => this.validateUniqueness())
      .then(() => this.willSave())
      .then(doc => this.save(doc))
      .then(json => this.didSave(json), err => this.saveDidFail(err));
  }

}
