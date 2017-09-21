import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('database');

test('database exist', function(assert) {
  assert.ok(this.db);
});

test('database has identifier', function(assert) {
  assert.equal(this.db.get('identifier'), 'thing');
});

test('database has store', function(assert) {
  let store = this.db.get('store');
  assert.ok(store);
  assert.ok(store === this.store);
});
