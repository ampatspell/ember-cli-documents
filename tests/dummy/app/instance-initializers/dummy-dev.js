import { Promise } from 'rsvp';
import Ember from 'ember';
import environment from '../config/environment';
import { getDefinition } from 'documents/properties';

const { COUCHDB_HOST } = environment;

const {
  Logger: { info }
} = Ember;

const databaseIdentifierMapping = {
  main: 'ember-cli-documents-dummy'
};

const createStore = stores => stores.store({
  url: `${COUCHDB_HOST}:6016`,
  fastbootIdentifier: 'dummy-documents',
  databaseNameForIdentifier: identifier => databaseIdentifierMapping[identifier] || identifier,
});

export default {
  name: 'dummy:dev',
  initialize(app) {
    window.Promise = Promise;

    let stores = app.lookup('documents:stores');
    let store = createStore(stores);
    let state = store.model({ type: 'state' });

    app.register('service:stores', stores, { instantiate: false });
    app.register('service:store', store, { instantiate: false });
    app.register('service:state', state, { instantiate: false });

    [ 'route', 'component' ].forEach(name => app.inject(name, 'state', 'service:state'));

    if(Ember.testing) {
      return;
    }

    window.log = info;
    window.stores = stores;
    window.store = store;
    window.state = state;
    window.database = store.get('db.main');
    window.getDefinition = getDefinition;
  }
};
