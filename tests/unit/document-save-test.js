import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { next } from 'documents/util/run';

module('document-save', {
  beforeEach() {
    return this.recreate();
  }
});

test('save succeeds', async function(assert) {
  let doc = this.db.doc({ id: 'duck:yellow', type: 'duck', name: 'Yellow' });

  let promise = doc.save().then(arg => assert.ok(arg === doc));

  await next();

  assert.deepEqual(doc.get('state'), {
    "error": null,
    "isDeleted": false,
    "isDirty": false,
    "isError": false,
    "isLoaded": false,
    "isLoading": false,
    "isNew": true,
    "isSaving": true
  });

  await promise;

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

  assert.ok(doc.get('rev'));

  let json = await this.docs.load('duck:yellow');

  assert.deepEqual_(json, {
    "_id": "duck:yellow",
    "_rev": "ignored",
    "name": "Yellow",
    "type": "duck"
  });
});

test('save fails with local conflict', async function(assert) {
  this.db.push({ _id: 'thing' });
  let doc = this.db.doc({ id: 'thing' });
  try {
    await doc.save();
    assert.ok(false, 'should throw');
  } catch(e) {
    assert.deepEqual(e.toJSON(), {
      "error": "conflict",
      "reason": "Document update conflict"
    });
  }
});
