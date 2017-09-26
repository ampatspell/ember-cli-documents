export default class Push {

  constructor(database, internal) {
    this._database = database;
    this._internal = internal;
  }

  get id() {
    return this._internal.getId();
  }

  get isDeleted() {
    return this._internal.isDeleted;
  }

  get(opts) {
    return this._database.existing(this.id, opts);
  }

}
