import Ember from 'ember';

const {
  Logger: { info }
} = Ember;

export default {
  name: 'dummy:dev',
  initialize(app) {
    let stores = app.lookup('documents:stores');
    let store = stores.store({ url: 'http://127.0.0.1:5984' });

    let db = store.database('thing');

    app.register('service:db', db, { instantiate: false });

    window.log = info;
    window.stores = stores;
    window.store = store;
    window.db = db;

    app.inject('route', 'db', 'service:db');
    app.inject('component', 'db', 'service:db');

    window.author = db.push({
      _id: 'author:ampatspell',
      _rev: '1-qwe',
      type: 'author',
      name: 'ampatspell'
    });

    window.blog = db.push({
      _id: 'blog:ducks',
      _rev: '1-asd',
      type: 'blog',
      title: 'The Ducks',
      owner: 'author:ampatspell'
    });

    window.post = db.push({
      _id: 'blog-post:ducks:one',
      _rev: '1-sdf',
      type: 'blog-post',
      title: 'Welcome',
      owner: 'author:ampatspell',
      blog: 'blog:ducks'
    });

  }
};
