import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('store-id');

test('db', function(assert) {
  assert.ok(this.store.get('id'));
  assert.ok(this.store.get('id').toString().includes('documents:store/id'));
});

test('lookup existing database', function(assert) {
  let db = this.store.get('id.ember-cli-documents');
  assert.ok(db);
  assert.ok(db === this.db);
});

test('lookup database', function(assert) {
  let db1 = this.store.get('id.first');
  let db2 = this.store.get('id.second');
  assert.ok(db1);
  assert.ok(db2);
  assert.ok(db1 !== db2);
});
