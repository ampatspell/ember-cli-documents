import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('internal-document-identity');

test('new document is added to identity', function(assert) {
  let doc = this.db.doc();
  let documents = this.db._documents;
  let internal = doc._internal;
  assert.ok(documents.all.indexOf(internal) !== -1);
  assert.ok(documents.new.indexOf(internal) !== -1);
});

test('create existing document is added to identity', function(assert) {
  let doc = this.db.existing('foo', { create: true });
  let documents = this.db._documents;
  let internal = doc._internal;
  assert.ok(doc);
  assert.ok(doc.get('id', 'foo'));
  assert.ok(documents.all.indexOf(internal) !== -1);
  assert.ok(documents.new.indexOf(internal) === -1);
  assert.ok(documents.saved.foo === internal);
  assert.ok(!documents.deleted.foo);
});
