import Ember from 'ember';
import InternalObject from './object';
import State from './state';

const {
  copy
} = Ember;

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

  get isNew() {
    return this.state.isNew;
  }

  _didDestroyModel() {
    super._didDestroyModel();
    this.database._didDestroyModelForInternalDocument(this);
  }

  _createModel() {
    return this.store._createDocumentModel(this);
  }

  setState(values, changed) {
    return this.state.set(values, changed);
  }

  getId() {
    return this._getValueNotify('_id');
  }

  setId(id) {
    return this._setValueNotify('_id', id);
  }

  getRev() {
    return this._getValueNotify('_rev');
  }

  setRev(rev) {
    return this._setValueNotify('_rev', rev);
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

}
