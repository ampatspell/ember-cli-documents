import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('database-internal-proxy-factory', {
  beforeEach() {
    this.owner = Ember.Object.create();
    this.opts = {
      query() {
      },
      matches() {
      },
      loaded() {
      }
    };
  }
});

test('destroy', function(assert) {
  let internal = this.db._createInternalProxy('first', this.owner, this.opts);
  assert.ok(internal);
  let proxy = internal.model(true);
  run(() => this.owner.destroy());
  assert.ok(proxy.isDestroyed);
});

test('first', function(assert) {
  let internal = this.db._createInternalProxy('first', null, this.opts);
  assert.ok(internal);
});

test('find', function(assert) {
  let internal = this.db._createInternalProxy('find', null, this.opts);
  assert.ok(internal);
});

test('paginated', function(assert) {
  let internal = this.db._createInternalProxy('paginated', null, this.opts);
  assert.ok(internal);
});
