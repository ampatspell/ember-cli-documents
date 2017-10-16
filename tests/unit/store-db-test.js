import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('store-db');

test('db', function(assert) {
  assert.ok(this.store.get('db'));
  assert.ok(this.store.get('db').toString().includes('documents:databases'));
});

test('lookup existing database', function(assert) {
  let db = this.store.get('db.ember-cli-documents');
  assert.ok(db);
  assert.ok(db === this.db);
});

test('lookup database', function(assert) {
  let db1 = this.store.get('db.first');
  let db2 = this.store.get('db.second');
  assert.ok(db1);
  assert.ok(db2);
  assert.ok(db1 !== db2);
});
