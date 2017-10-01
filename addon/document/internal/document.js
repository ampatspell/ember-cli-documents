import Ember from 'ember';
import InternalObject from './object';
import State from './-state';
import Queue from './-queue';

const {
  Logger: { error }
} = Ember;

const isKeyUnderscored = key => key && key.indexOf('_') === 0;

export default class InternalDocument extends InternalObject {

  constructor(store, database) {
    super(store, null);
    this.database = database;
    this.state = new State();
    this.queue = new Queue();
  }

  addOperation(op) {
    return this.queue.add(op);
  }

  get isDocument() {
    return true;
  }

  get isNew() {
    return this.state.isNew;
  }

  get isDeleted() {
    return this.state.isDeleted;
  }

  _didDestroyModel() {
    super._didDestroyModel();
    this.database._didDestroyModelForInternalDocument(this);
  }

  _createModel() {
    return this.store._createDocumentModel(this);
  }

  getId() {
    return this._getValue('id');
  }

  setId(id) {
    if(!this.isNew && id !== this.getId()) {
      let current = this.getId();
      error(`Document id cannot be changed after document is saved. Attempted to set id '${id}' for document '${current}'`);
      return current;
    }
    return this._setValueNotify('id', id, 'model');
  }

  getRev() {
    return this._getValue('rev');
  }

  getIdRev() {
    return {
      id: this.getId(),
      rev: this.getRev()
    };
  }

  //

  _createAttachments() {
    return this.store._createInternalAttachments(this);
  }

  attachments(create) {
    let attachments = this._getValue('attachments');
    if(!attachments && create) {
      attachments = this._createAttachments();
      this.values.attachments = attachments;
    }
    return attachments;
  }

  getAttachments() {
    return this.attachments(true).model(true);
  }

  setAttachments(values) {
    let attachments = this.attachments(true);
    attachments.withPropertyChanges(changed => attachments._deserialize(values, 'model', changed), true);
    return attachments.model(true);
  }

  deserializeAttachments(doc, changed) {
    let _attachments = doc._attachments;
    let attachments = this.attachments(false);

    if(!_attachments && !attachments) {
      return;
    }

    _attachments = _attachments || {};
    attachments = attachments || this.attachments(true);

    attachments._deserialize(_attachments, 'document', changed);
  }

  //

  _setValue(key, ...rest) {
    if(isKeyUnderscored(key)) {
      return;
    }
    if(key === 'attachments') {
      return this.attachments(true)._deserialize(...rest);
    }
    return super._setValue(...arguments);
  }

  _getValue(key) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return super._getValue(...arguments);
  }

  deserializeDeleted(json, changed) {
    let type = 'document';
    let { id, rev } = json;
    this._setValue('id', id, type, changed);
    this._setValue('rev', rev, type, changed);
  }

  deserializeSaved(json, changed) {
    let type = 'document';
    let { id, rev } = json;
    this._setValue('id', id, type, changed);
    this._setValue('rev', rev, type, changed);
  }

  //

  setState(name, notify=true) {
    this.withPropertyChanges(changed => {
      let state = this.state;
      let fn = state[name];
      fn.call(state, changed);
    }, notify);
  }

  //

  scheduleSave() {
    return this.database._scheduleInternalSave(this, ...arguments);
  }

  scheduleLoad() {
    return this.database._scheduleInternalLoad(this, ...arguments);
  }

  scheduleReload() {
    return this.database._scheduleInternalReload(this, ...arguments);
  }

  scheduleDelete() {
    return this.database._scheduleInternalDelete(this, ...arguments);
  }

}
