import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-save');

test('save succeeds', async function(assert) {
  let doc = this.db.doc({ id: 'duck' });

  let promise = doc.save().then(arg => assert.ok(arg === doc));

  assert.ok(promise);

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
});
