import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('database-internal-find', {
  beforeEach() {
    return this.recreate();
  }
});

test('load by id as a string', async function(assert) {
  let saved = await this.docs.save({ _id: 'duck:yellow' });
  let { type, result } = await this.db._internalDocumentFind('duck:yellow');
  assert.equal(type, 'single');
  assert.equal(result.getRev(), saved.rev);
  assert.ok(this.db._documents.saved['duck:yellow']);
  assert.deepEqual_(result.state, {
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

test('load by id prop', async function(assert) {
  let saved = await this.docs.save({ _id: 'duck:yellow' });
  let { type, result } = await this.db._internalDocumentFind({ id: 'duck:yellow' });
  assert.equal(type, 'single');
  assert.equal(result.getId(), 'duck:yellow');
});

test('load by id existing', async function(assert) {
  let saved = await this.docs.save({ _id: 'duck:yellow' });
  let doc = this.db.existing('duck:yellow', { create: true });
  let { result } = await this.db._internalDocumentFind('duck:yellow');
  assert.ok(doc._internal === result);
});
