import Ember from 'ember';
import environment from '../config/environment';

const { COUCHDB_HOST } = environment;

const {
  Logger: { info }
} = Ember;

export default {
  name: 'dummy:dev',
  initialize(app) {
    let stores = app.lookup('documents:stores');
    let store = stores.store({ url: `${COUCHDB_HOST}:6016` });

    store.enableFastBootWithIdentifier('dummy-documents');

    let db = store.database('thing');

    let changes = db.changes({ feed: 'event-source' });
    changes.start();

    app.register('service:store', store, { instantiate: false });
    app.register('service:db', db, { instantiate: false });

    window.log = info;
    window.stores = stores;
    window.store = store;
    window.db = db;
    window.recreate = () => db.get('documents.database').recreate({ documents: true, design: true });

    app.inject('route', 'store', 'service:store');
    app.inject('route', 'db', 'service:db');
    app.inject('component', 'store', 'service:store');
    app.inject('component', 'db', 'service:db');

    window.author = db.doc({
      id: 'author:ampatspell',
      type: 'author',
      name: 'ampatspell'
    });

    window.blog = db.doc({
      id: 'blog:ducks',
      type: 'blog',
      title: 'The Ducks',
      owner: 'author:ampatspell'
    });

    window.post = db.doc({
      id: 'blog-post:ducks:one',
      type: 'blog-post',
      title: 'Welcome',
      owner: 'author:ampatspell',
      blog: 'blog:ducks'
    });

  }
};
