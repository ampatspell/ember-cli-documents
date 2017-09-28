import Ember from 'ember';
import { test } from '../helpers/qunit';
import configurations from '../helpers/configurations';

const {
  RSVP: { all }
} = Ember;

configurations({ identifiers: [ 'couchdb-2.1' ] }, module => {

  module('database-internal-mango', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('find mango returns empty array', async function(assert) {
    let { type, result } = await this.db._internalDocumentFind({ selector: {} });
    assert.equal(type, 'array');
    assert.equal(result.length, 0);
  });

  test('find mango returns documents', async function(assert) {
    await all([
      this.docs.save({ _id: 'one', type: 'foo' }),
      this.docs.save({ _id: 'two', type: 'bar' }),
      this.docs.save({ _id: 'three', type: 'foo' })
    ]);

    let { type, result } = await this.db._internalDocumentFind({ selector: { type: 'foo' } });
    assert.equal(type, 'array');
    assert.equal(result.length, 2);
    assert.deepEqual(result.map(internal => internal.getId()), [ 'one', 'three' ]);
  });

  test('load first with existing docs', async function(assert) {
    await all([
      this.docs.save({ _id: 'one', type: 'foo' }),
      this.docs.save({ _id: 'two', type: 'bar' }),
      this.docs.save({ _id: 'three', type: 'foo' })
    ]);

    let internal = await this.db._internalDocumentFirst({ selector: { type: 'foo' } });
    assert.equal(internal.getId(), 'one');
  });

  test('load first with no docs', async function(assert) {
    try {
      await this.db._internalDocumentFirst({ selector: { type: 'foo' } });
      assert.ok(false);
    } catch(e) {
      assert.deepEqual(e.toJSON(), {
        "error": "not_found",
        "reason": "missing",
        "status": 404
      });
    }
  });

});
