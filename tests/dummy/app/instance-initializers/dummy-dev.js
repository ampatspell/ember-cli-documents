export default {
  name: 'dummy:dev',
  initialize(app) {
    let Database = app.factoryFor('documents:database');
    let db = Database.create();
    app.register('service:db', db, { instantiate: false });
    window.db = db;

    app.inject('route', 'db', 'service:db');
    app.inject('component', 'db', 'service:db');

    window.author = db.push({
      _id: 'author:ampatspell',
      type: 'author',
      name: 'ampatspell'
    });

    window.blog = db.push({
      _id: 'blog:ducks',
      type: 'blog',
      title: 'The Ducks',
      owner: 'author:ampatspell'
    });

    window.post = db.push({
      _id: 'blog-post:ducks:one',
      type: 'blog-post',
      title: 'Welcome',
      owner: 'author:ampatspell',
      blog: 'blog:ducks'
    });

  }
};
