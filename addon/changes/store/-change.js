export default class Change {

  constructor(store, json) {
    this._store = store;
    this._json = json;
  }

  get type() {
    return this._json.type;
  }

  get name() {
    return this._json.name;
  }

  get() {
    return this._store.database(this.name);
  }

}
