import { module } from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import environment from '../../config/environment';
import tap from './tap-document-requests';

const host = environment.COUCHDB_HOST;

const {
  RSVP: { resolve },
  assert
} = Ember;

const getter = (object, name, fn) => Object.defineProperty(object, name, { get: () => fn() });

const configs = {
  'couchdb-1.6': {
    store: {
      url: `${host}:6016`
    },
    feed: 'continuous'
  },
  'couchdb-2.1': {
    store: {
      url: `${host}:6020`
    },
    feed: 'continuous'
  }
};

for(let key in configs) {
  configs[key].identifier = key;
}

const defaultConfig = configs['couchdb-1.6'];

export const availableIdentifiers = Object.keys(configs);

export default identifier => {
  let config = identifier ? configs[identifier] : defaultConfig;
  assert(`config for identifier ${identifier} not found`, !!config);
  return function(name, options={}) {
    let moduleName = name;
    if(identifier) {
      moduleName = `${moduleName} - ${identifier}`;
    }
    module(moduleName, {
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
      tap(db) {
        db = db || this.db;
        return tap(db.get('documents'));
      },
      register(...args) {
        return this.instance.register(...args);
      },
      beforeEach() {
        this.application = startApp();
        this.instance = this.application.buildInstance();
        getter(this, 'stores', () => this.instance.lookup('documents:stores'));
        getter(this, 'store', () => this.stores.store(config.store));
        getter(this, 'db', () => this.store.database('ember-cli-documents'));
        getter(this, 'docs', () => this.db.get('documents'));
        getter(this,  'config', () => config);
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
}
