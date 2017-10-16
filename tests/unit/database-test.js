import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('database');

test('database exist', function(assert) {
  assert.ok(this.db);
});

test('database has name and identifier', function(assert) {
  assert.equal(this.db.get('identifier'), 'ember-cli-documents');
  assert.equal(this.db.get('name'), 'ember-cli-documents');
});

test('database has store', function(assert) {
  let store = this.db.get('store');
  assert.ok(store);
  assert.ok(store === this.store);
});
