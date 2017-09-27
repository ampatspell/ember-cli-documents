import Ember from 'ember';

const {
  Logger: { info }
} = Ember;

export default {
  name: 'dummy:dev',
  initialize(app) {
    let stores = app.lookup('documents:stores');
    let store = stores.store({ url: 'http://dev:6016' });

    let db = store.database('thing');

    app.register('service:db', db, { instantiate: false });

    window.log = info;
    window.stores = stores;
    window.store = store;
    window.db = db;

    app.inject('route', 'db', 'service:db');
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
