import Ember from 'ember';
import createNestedRegistry from '../util/create-nested-registry';

const DatabasesRegistry = createNestedRegistry({ key: '_databases' });

export default Ember.Mixin.create(DatabasesRegistry, {

  _databases: null,

  _normalizeDatabaseIdentifier(identifier) {
    return identifier.trim();
  },

  _createDatabase(identifier) {
    let store = this;
    let _adapter = this.get('_adapter').createDatabaseAdapter();
    let database = this._factoryFor(`documents:database`).create({ store, _adapter, identifier });
    _adapter.setProperties({ database });
    return database;
  },

  database(identifier) {
    let databases = this._databases;
    let normalizedIdentifier = this._normalizeDatabaseIdentifier(identifier);
    let database = databases.get(normalizedIdentifier);
    if(!database) {
      database = this._createDatabase(normalizedIdentifier);
      databases.set(normalizedIdentifier, database);
    }
    return database;
  },

  _databaseWillDestroy(db) {
    let identifier = db.get('identifier');
    this._databases.remove(identifier);
  },

  willDestroy() {
    this._databases.destroy();
    this._super();
  }

});
