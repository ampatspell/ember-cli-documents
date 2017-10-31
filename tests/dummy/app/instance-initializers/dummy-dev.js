import Ember from 'ember';
import environment from '../config/environment';

const { COUCHDB_HOST } = environment;

const {
  RSVP: { Promise },
  Logger: { info }
} = Ember;

const databaseMapping = {
  main: 'ember-cli-documents-dummy'
};

const url = `${COUCHDB_HOST}:6016`;
const databaseNameForIdentifier = identifier => databaseMapping[identifier] || identifier;
const fastbootIdentifier = 'dummy-documents';

export default {
  name: 'dummy:dev',
  initialize(app) {
    window.Promise = Promise;

    let stores = app.lookup('documents:stores');
    let store = stores.store({ url, databaseNameForIdentifier, fastbootIdentifier });
    let state = store.model('state');

    app.register('service:stores', stores, { instantiate: false });
    app.register('service:store', store, { instantiate: false });
    app.register('service:state', state, { instantiate: false });

    [ 'route', 'component' ].forEach(name => app.inject(name, 'state', 'service:state'));

    window.log = info;
    window.stores = stores;
    window.store = store;
    window.state = state;
    window.database = store.get('db.main');
  }
};
