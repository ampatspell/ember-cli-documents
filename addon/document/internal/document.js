import InternalObject from './object';
import State from './state';

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

}
