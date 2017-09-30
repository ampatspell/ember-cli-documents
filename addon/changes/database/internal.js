import Changes from '../internal';

export default class DatabaseChanges extends Changes {

  constructor(store, database, opts) {
    super(store, opts);
    this.database = database;
  }

  _createAdapter(opts) {
    return this.database.get('_adapter').changesListener(opts);
  }

  _createModel() {
    return this.store._createDatabaseChangesModel(this);
  }

}
