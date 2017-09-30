import Changes from '../internal';

export default class DatabaseChanges extends Changes {

  constructor(store, opts) {
    super(store, opts);
  }

  _createAdapter(opts) {
    return this.store.get('_adapter').changesListener(opts);
  }

  _createModel() {
    return this.store._createStoreChangesModel(this);
  }

  _processData(json) {
    let { db_name: name, type } = json;
    return { type, name };
  }

}
