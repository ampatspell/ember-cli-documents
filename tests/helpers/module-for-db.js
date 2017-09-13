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
      this.db = this.instance.factoryFor('documents:database').create();
      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },
    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return resolve(afterEach).then(() => {
        Ember.run(() => this.db.destroy());
        Ember.run(() => this.instance.destroy());
        destroyApp(this.application);
      });
    }
  });
}
