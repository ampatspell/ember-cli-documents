import Adapter from '../database';

export default Adapter.extend({

  adapter: null,

  databaseDocuments(database) {
    let identifier = database.get('identifier');
    return this.get('adapter.couch').database(identifier);
  }

});
