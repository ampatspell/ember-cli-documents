import Ember from 'ember';

const {
  A,
  merge
} = Ember;

export default Ember.Mixin.create({

  __deserializeShoeboxDatabase(payload) {
    let { identifier } = payload;
    let db = this.database(identifier);
    db._deserializeShoebox(payload);
  },

  _deserializeShoebox(payload) {
    let { databases } = payload;
    databases.map(json => this.__deserializeShoeboxDatabase(json));
  },

  __serializeShoeboxDatabase(database) {
    let identifier = database.get('identifier');
    return merge({ identifier }, database._serializeShoebox());
  },

  __serializeShoeboxDatabases() {
    let databases = this.get('openDatabases');
    return A(Object.keys(databases)).map(key => this.__serializeShoeboxDatabase(databases[key]));
  },

  _serializeShoebox() {
    let databases = this.__serializeShoeboxDatabases();
    return {
      databases
    };
  }

});
