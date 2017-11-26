import { Stores } from 'documents';
import environment from './config/environment';

const url = `${environment.COUCHDB_HOST}:6016`;

const mapping = {
  main: 'ember-cli-documents-dummy'
};

const databaseNameForIdentifier = identifier => {
  return mapping[identifier] || identifier;
};

export default Stores.extend({

  storeOptionsForIdentifier(identifier) {
    if(identifier === 'remote') {
      return {
        adapter: 'couch',
        url,
        databaseNameForIdentifier
      }
    }
  }

});
