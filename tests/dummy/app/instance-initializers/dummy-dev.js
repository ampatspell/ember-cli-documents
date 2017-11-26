import Ember from 'ember';
import { Promise } from 'rsvp';
import { getDefinition } from 'documents/properties';

export default {
  name: 'dummy:dev',
  initialize(app) {
    window.Promise = Promise;

    let stores = app.lookup('documents:stores');
    let store = stores.store('remote');
    let database = store.database('main');
    let state = database.model('state');

    app.register('service:stores', stores, { instantiate: false });
    app.register('service:store', store, { instantiate: false });
    app.register('service:state', state, { instantiate: false });

    [ 'route', 'component' ].forEach(name => app.inject(name, 'state', 'service:state'));

    if(Ember.testing) {
      return;
    }

    window.stores = stores;
    window.store = store;
    window.state = state;
    window.database = database;
    window.getDefinition = getDefinition;
  }
};
