import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('database-document');

test('doc creates a new document which is added to identity.new', function(assert) {
  let doc = this.db.doc();
  assert.ok(doc);
  assert.equal(doc.get('isNew'), true);
  let internal = doc._internal;
  let identity = this.db._documents;
  assert.ok(identity.all.includes(internal));
  assert.ok(identity.new.includes(internal));
});

test('destroyed new document is removed from identity', function(assert) {
  let doc = this.db.doc();
  let internal = doc._internal;

  run(() => doc.destroy());

  let identity = this.db._documents;
  assert.ok(!identity.all.includes(internal));
  assert.ok(!identity.new.includes(internal));
});
