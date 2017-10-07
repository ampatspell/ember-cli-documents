import Ember from 'ember';
import EmptyObject from '../util/empty-object';

const {
  A,
  on,
  copy
} = Ember;

export default Ember.Mixin.create({

  _databases: null,

  _setupDatabases: on('init', function() {
    this._databases = new EmptyObject();
    this._databases.keyed = new EmptyObject();
    this._databases.all = A();
  }),

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
    let database = databases.keyed[normalizedIdentifier];
    if(!database) {
      database = this._createDatabase(normalizedIdentifier);
      databases.keyed[normalizedIdentifier] = database;
      databases.all.pushObject(database);
    }
    return database;
  },

  _databaseWillDestroy(db) {
    let identifier = db.get('identifier');
    let databases = this._databases;
    delete databases.keyed[identifier];
    databases.all.removeObject(db);
  },

  willDestroy() {
    this._super();
    copy(this._databases.all).forEach(db => db.destroy());
  }

});
