import Changes from '../internal';

export default class DatabaseChanges extends Changes {

  constructor(store, database, opts) {
    super(store, opts);
    this.database = database;
  }

  _createModel() {
    return this.store._createDatabaseChangesModel(this);
  }

}
