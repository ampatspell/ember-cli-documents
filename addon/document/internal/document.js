import InternalObject from './object';
import State from './state';

export default class InternalDocument extends InternalObject {

  constructor(store, database, parent) {
    super(store, null);
    this.database = database;
    this.state = new State();
  }

  _createModel() {
    return this.store._createDocumentModel(this);
  }

  setState(values, changed) {
    return this.state.set(values, changed);
  }

}
