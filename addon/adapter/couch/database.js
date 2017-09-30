import Adapter from '../database';

export default Adapter.extend({

  adapter: null,

  databaseDocuments(database) {
    let identifier = database.get('identifier');
    let couch = this.get('adapter.couch');
    return couch.database(identifier);
  },

  changesListener(opts) {
    let docs = this.get('database.documents');
    return docs.createChanges(opts);
  }

});
