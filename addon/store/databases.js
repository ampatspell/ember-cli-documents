import Ember from 'ember';
import { object } from '../util/computed';

const {
  String: { dasherize }
} = Ember;

export default Ember.Mixin.create({

  openDatabases: object().readOnly(),

  normalizeDatabaseIdentifier(identifier) {
    return dasherize(identifier);
  },

  createDatabase(identifier) {
    let store = this;
    return this._factoryFor(`documents:database`).create({ store, identifier });
  },

  database(identifier) {
    let open = this.get('openDatabases');
    let normalizedIdentifier = this.normalizeDatabaseIdentifier(identifier);
    let database = open[normalizedIdentifier];
    if(!database) {
      database = this.createDatabase(normalizedIdentifier);
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
    this._super(...arguments);
    let open = this.cacheFor('openDatabases');
    for(let key in open) {
      let value = open[key];
      value.destroy();
    }
  }

});
