import Mixin from '@ember/object/mixin';
import { merge } from '@ember/polyfills';

export default Mixin.create({

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
    return this._databases.all.map(database => this.__serializeShoeboxDatabase(database));
  },

  _serializeShoebox() {
    let databases = this.__serializeShoeboxDatabases();
    return {
      databases
    };
  }

});
