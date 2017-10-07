import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('store-identity');

test('it exists', function(assert) {
  let identity = this.store.get('identity');
  assert.ok(identity);
  assert.ok(identity.get('length') === 0);
});

test('identity includes new docs', function(assert) {
  let identity = this.store.get('identity');
  assert.ok(identity.get('length') === 0);
  let doc = this.db.doc();
  assert.ok(identity.get('length') === 1);
  assert.ok(identity.get('lastObject') === doc);
});

test('identity includes docs from newly created db', function(assert) {
  let identity = this.store.get('identity');
  assert.ok(identity.get('length') === 0);

  let doc = this.db.doc();
  assert.ok(identity.get('length') === 1);

  let db = this.store.database('another');
  let another = db.doc();
  assert.ok(identity.get('length') === 2);
});

test('docs are removed from identity', function(assert) {
  let identity = this.store.get('identity');
  assert.ok(identity.get('length') === 0);

  let doc = this.db.doc();
  assert.ok(identity.get('lastObject') === doc);

  run(() => doc.destroy());

  assert.ok(identity.get('length') === 0);
});
