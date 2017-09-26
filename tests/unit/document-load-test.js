import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { next } from 'documents/util/run';

module('document-load', {
  beforeEach() {
    return this.recreate();
  }
});

test('load succeeds', async function(assert) {
  let json = await this.docs.save({ _id: 'thing', name: 'hello' });
  let doc = this.db.existing('thing', { create: true });

  assert.deepEqual(doc.get('state'), {
    "error": null,
    "isDeleted": false,
    "isDirty": false,
    "isError": false,
    "isLoaded": false,
    "isLoading": false,
    "isNew": false,
    "isSaving": false
  });

  let promise = doc.load();

  await next();

  assert.deepEqual(doc.get('state'), {
    "error": null,
    "isDeleted": false,
    "isDirty": false,
    "isError": false,
    "isLoaded": false,
    "isLoading": true,
    "isNew": false,
    "isSaving": false
  });

  let ret = await promise;
  assert.ok(ret === doc);

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

  assert.deepEqual(doc.get('serialized'), {
    "id": "thing",
    "rev": json.rev,
    "name": "hello"
  });
});
