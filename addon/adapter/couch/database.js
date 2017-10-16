import Adapter from '../database';

export default Adapter.extend({

  adapter: null,

  databaseDocuments(database) {
    let name = database.get('name');
    let couch = this.get('adapter.couch');
    return couch.database(name);
  },

  changesListener(opts) {
    let docs = this.get('database.documents');
    return docs.createChanges(opts);
  }

});
