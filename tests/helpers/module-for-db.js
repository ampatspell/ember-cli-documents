import { module } from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

const {
  RSVP: { resolve }
} = Ember;

const getter = (object, name, fn) => Object.defineProperty(object, name, { get: () => fn() });

export default function(name, options = {}) {
  module(name, {
    admin(db) {
      db = db || this.db;
      return db.get('documents.couch.session').save('admin', 'hello');
    },
    logout(db) {
      db = db || this.db;
      return db.get('documents.couch.session').delete();
    },
    recreate(db) {
      db = db || this.db;
      return this.admin(db).then(() => db.get('documents.database').recreate({ documents: true, design: true }));
    },
    beforeEach() {
      this.application = startApp();
      this.instance = this.application.buildInstance();
      getter(this, 'stores', () => this.instance.lookup('documents:stores'));
      getter(this, 'store', () => this.stores.store({ url: 'http://dev.amateurinmotion.com:6016' }));
      getter(this, 'db', () => this.store.database('ember-cli-documents'));
      getter(this, 'docs', () => this.db.get('documents'));
      let beforeEach = options.beforeEach && options.beforeEach.apply(this, arguments);
      return resolve(beforeEach);
    },
    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return resolve(afterEach).then(() => {
        Ember.run(() => this.instance.destroy());
        destroyApp(this.application);
      });
    }
  });
}
