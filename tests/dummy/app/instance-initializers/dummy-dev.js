import Ember from 'ember';
import { Promise } from 'rsvp';

export default {
  name: 'dummy:dev',
  initialize(app) {
    window.Promise = Promise;

    app.inject('component', 'router', 'router:main');

    if(Ember.testing) {
      return;
    }

    let stores = app.lookup('documents:stores');
    let store = stores.store('remote');
    let database = store.database('main');

    window.stores = stores;
    window.store = store;
    window.database = database;

    // let props = state.getProperties('stores', 'store', 'database');
    // for(let key in props) {
    //   window[key] = props[key];
    // }
  }
};
