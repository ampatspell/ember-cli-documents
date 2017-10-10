import configurations from '../helpers/configurations';
import { test } from '../helpers/qunit';

configurations(module => {

  module('database-internal-create-operation', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('find by id', async function(assert) {
    let saved = await this.docs.save({ _id: 'duck:yellow' });
    let op = this.db.__scheduleDocumentFindOperation('duck:yellow');
    let { type, result } = await op.promise;
    assert.equal(type, 'single');
    assert.equal(result.getRev(), saved.rev);
  });

  test('first by id', async function(assert) {
    let saved = await this.docs.save({ _id: 'duck:yellow' });
    let op = this.db.__scheduleDocumentFirstOperation('duck:yellow');
    let internal = await op.promise;
    assert.equal(internal.getRev(), saved.rev);
  });

  test('load existing', async function(assert) {
    await this.docs.save({ _id: 'duck:yellow' });
    let doc = this.db.existing('duck:yellow', { create: true });
    let op = this.db.__scheduleDocumentFirstOperation('duck:yellow');
    let result = await op.promise;
    assert.ok(doc._internal === result);
  });

});
