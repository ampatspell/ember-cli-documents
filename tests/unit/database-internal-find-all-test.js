import { all } from 'rsvp';
import configurations from '../helpers/configurations';
import { test } from '../helpers/qunit';

configurations(module => {

  module('database-internal-find-all', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('find all returns empty array', async function(assert) {
    let { type, result } = await this.db._internalDocumentFind({ all: true });
    assert.equal(type, 'array');
    assert.equal(result.length, 0);
  });

  test('find all returns documents', async function(assert) {
    await all([
      this.db.doc({ id: 'one' }).save(),
      this.db.doc({ id: 'two' }).save()
    ]);
    let { type, result } = await this.db._internalDocumentFind({ all: true });
    assert.equal(type, 'array');
    assert.equal(result.length, 2);
    assert.deepEqual(result.map(internal => internal.getId()), [ 'one', 'two' ]);
  });

});
