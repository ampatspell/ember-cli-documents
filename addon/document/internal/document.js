import Ember from 'ember';
import InternalObject from './object';
import State from './state';

const {
  copy,
  Logger: { error }
} = Ember;

const isKeyUnderscored = key => key && key.indexOf('_') === 0;

const replace = (from, to, json) => {
  let value = json[from];
  delete json[from];
  if(value === undefined) {
    delete json[to];
  } else {
    json[to] = value;
  }
  return json;
};

export default class InternalDocument extends InternalObject {

  constructor(store, database) {
    super(store, null);
    this.database = database;
    this.state = new State();
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
    return this._getValueNotify('_id', 'model');
  }

  setId(id) {
    if(!this.isNew && id !== this.getId()) {
      let current = this.getId();
      error(`Document id cannot be changed after document is saved. Attempted to set id '${id}' for document '${current}'`);
      return current;
    }
    return this._setValueNotify('_id', id, 'model');
  }

  getRev() {
    return this._getValueNotify('_rev', 'model');
  }

  setValue(key) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return super.setValue(...arguments);
  }

  getValue(key) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return super.getValue(...arguments);
  }

  willDeserialize(json, type) {
    json = json || {};
    if(type === 'model') {
      json = copy(json, false);
      replace('id', '_id', json);
      replace('rev', '_rev', json);
    }
    return json;
  }

  didSerialize(json, type) {
    if(type === 'model') {
      replace('_id', 'id', json);
      replace('_rev', 'rev', json);
    }
    return json;
  }

  deserializeDeleted(json, changed) {
    let type = 'document';
    json = this.willDeserialize(json, type);
    let { id, rev } = json;
    this._setValue('_id', id, type, changed);
    this._setValue('_rev', rev, type, changed);
  }

  deserializeSaved(json, changed) {
    let type = 'document';
    let { id, rev } = json;
    this._setValue('_id', id, type, changed);
    this._setValue('_rev', rev, type, changed);
  }

  //

  enqueueSave() {
    return this.database._enqueueInternalSave(this, ...arguments);
  }

  enqueueLoad() {
    return this.database._enqueueInternalLoad(this, ...arguments);
  }

  enqueueReload() {
    return this.database._enqueueInternalReload(this, ...arguments);
  }

  enqueueDelete() {
    return this.database._enqueueInternalDelete(this, ...arguments);
  }

}
