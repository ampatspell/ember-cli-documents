import module from '../helpers/module-for-db';
import { test } from 'ember-qunit';
import Database from 'documents/database';

module('experimental');

test('app is present', function(assert) {
  assert.ok(this.application);
});

test('instance is present', function(assert) {
  assert.ok(this.instance);
});

test('db is present', function(assert) {
  assert.ok(this.db);
  assert.ok(Database.detectInstance(this.db));
});
