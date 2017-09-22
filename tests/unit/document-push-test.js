import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-basic');

test('push fresh', function(assert) {
  let docs = this.db._documents;
  let doc = this.db.push({ _id: 'hello' });
  assert.ok(doc);
  assert.equal(doc.get('id'), 'hello');
  assert.ok(docs.all.includes(doc._internal));
  assert.ok(!docs.new.includes(doc._internal));
  assert.ok(docs.saved.hello === doc._internal);
  assert.deepEqual(doc.get('state'), {
    "error": null,
    "isDeleted": false,
    "isDirty": false,
    "isError": false,
    "isLoaded": true,
    "isLoading": false,
    "isNew": false,
    "isSaving": false
  });
});

test('push update to existing', function(assert) {
  let first = this.db.push({ _id: 'hello', name: 'one', old: true });

  assert.equal(first.get('name'), 'one');
  assert.equal(first.get('old'), true);
  assert.deepEqual(first.get('state'), {
    "error": null,
    "isDeleted": false,
    "isDirty": false,
    "isError": false,
    "isLoaded": true,
    "isLoading": false,
    "isNew": false,
    "isSaving": false
  });

  let second = this.db.push({ _id: 'hello', name: 'two', fresh: true });

  assert.ok(first === second);
  assert.ok(first._internal === second._internal);

  assert.equal(second.get('name'), 'two');
  assert.equal(second.get('fresh'), true);
  assert.equal(second.get('old'), undefined);
  assert.deepEqual(second.get('state'), {
    "error": null,
    "isDeleted": false,
    "isDirty": false,
    "isError": false,
    "isLoaded": true,
    "isLoading": false,
    "isNew": false,
    "isSaving": false
  });
});

test('push fresh deleted', function(assert) {
  let docs = this.db._documents;
  let doc = this.db.push({ _id: 'hello', _deleted: true });
  assert.ok(doc);
  assert.deepEqual(doc.get('state'), {
    "error": null,
    "isDeleted": true,
    "isDirty": false,
    "isError": false,
    "isLoaded": true,
    "isLoading": false,
    "isNew": false,
    "isSaving": false
  });
  assert.ok(!docs.all.includes(doc._internal));
  assert.ok(!docs.new.includes(doc._internal));
  assert.ok(!docs.saved.hello);
  assert.ok(docs.deleted.hello);
});

test('resurrect deleted', function(assert) {
  let docs = this.db._documents;
  let doc = this.db.push({ _id: 'hello', _deleted: true });
  let res = this.db.push({ _id: 'hello', name: 'foof' });
  assert.ok(doc === res);

  assert.ok(docs.all.includes(doc._internal));
  assert.ok(!docs.new.includes(doc._internal));
  assert.ok(docs.saved.hello);
  assert.ok(!docs.deleted.hello);
});
