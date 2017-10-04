import Ember from 'ember';
import { object } from '../util/computed';

const {
  A
} = Ember;

export default Ember.Mixin.create({

  openDatabases: object().readOnly(),

  _openDatabases() {
    let databases = this.get('openDatabases')
    return A(A(Object.keys(databases)).map(key => databases[key]));
  },

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
    let open = this.get('openDatabases');
    let normalizedIdentifier = this._normalizeDatabaseIdentifier(identifier);
    let database = open[normalizedIdentifier];
    if(!database) {
      database = this._createDatabase(normalizedIdentifier);
      open[normalizedIdentifier] = database;
    }
    return database;
  },

  _databaseWillDestroy(db) {
    let identifier = db.get('identifier');
    let open = this.get('openDatabases');
    delete open[identifier];
  },

  willDestroy() {
    this._super();
    let open = this.cacheFor('openDatabases');
    for(let key in open) {
      let value = open[key];
      value.destroy();
    }
  }

});
