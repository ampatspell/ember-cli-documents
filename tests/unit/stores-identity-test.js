import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('stores-identity');

test('it exists', function(assert) {
  let identity = this.stores.get('identity');
  assert.ok(identity);
  assert.ok(identity.get('length') === 0);
});

test('identity includes new docs', function(assert) {
  let identity = this.stores.get('identity');
  assert.ok(identity.get('length') === 0);
  let doc = this.db.doc();
  assert.ok(identity.get('length') === 1);
  assert.ok(identity.get('lastObject') === doc);
});

test('identity includes docs from newly created db', function(assert) {
  let identity = this.stores.get('identity');
  assert.ok(identity.get('length') === 0);

  let doc = this.db.doc();
  assert.ok(identity.get('length') === 1);

  let db = this.store.database('another');
  let another = db.doc();
  assert.ok(identity.get('length') === 2);
  assert.ok(identity.mapBy('_internal'), [ doc._internal, another._internal ]);
});

test('docs are removed from identity', function(assert) {
  let identity = this.stores.get('identity');
  assert.ok(identity.get('length') === 0);

  let doc = this.db.doc();
  assert.ok(identity.get('lastObject') === doc);

  run(() => doc.destroy());

  assert.ok(identity.get('length') === 0);
});

test('docs are removed from destroyed db', function(assert) {
  let identity = this.stores.get('identity');
  assert.ok(identity.get('length') === 0);

  let doc = this.db.doc();
  assert.ok(identity.get('lastObject') === doc);

  run(() => this.db.destroy());

  assert.ok(identity.get('length') === 0);
});

test('destroyed store db documents are removed from identity', function(assert) {
  let identity = this.stores.get('identity');
  assert.ok(identity.get('length') === 0);

  let doc = this.db.doc();
  assert.ok(identity.get('lastObject') === doc);

  run(() => this.store.destroy());

  assert.ok(identity.get('length') === 0);
});
