import { module } from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

const {
  RSVP: { resolve }
} = Ember;

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      this.instance = this.application.buildInstance();
      this.stores = this.instance.lookup('documents:stores');
      this.store = this.stores.store({ url: 'http://127.0.0.1:5984' });
      this.db = this.store.database('thing');
      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
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
