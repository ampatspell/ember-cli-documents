import Ember from 'ember';
import configurations from '../helpers/configurations';
import { test } from '../helpers/qunit';

const {
  RSVP: { all },
  run
} = Ember;

configurations(module => {

  module('database-internal-find-by-ids', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('load by ids', async function(assert) {
    await all([
      this.docs.save({ _id: 'one' }),
      this.docs.save({ _id: 'two' })
    ]);

    let { type, result } = await this.db._internalDocumentFind({ ids: [ 'one', 'two' ] });
    assert.equal(type, 'array');
    assert.equal(result.length, 2);
    assert.deepEqual(result.map(internal => internal.getId()), [ 'one', 'two' ]);
  });

  test('load by ids with one already loaded', async function(assert) {
    let one = this.db.existing('one', { create: true });
    await all([
      this.docs.save({ _id: 'one' }),
      this.docs.save({ _id: 'two' })
    ]);

    let promise = this.db._internalDocumentFind({ ids: [ 'one', 'two' ] });

    run(() => {});

    assert.equal(one.get('isLoading'), true, 'isloading');

    let { type, result } = await promise;
    assert.equal(type, 'array');
    assert.equal(result.length, 2);
    assert.deepEqual(result.map(internal => internal.getId()), [ 'one', 'two' ]);

    assert.equal(one.get('isLoading'), false, 'not loading');
  });

  test.todo('load by ids rejects if some of ids not found', async function() {

  });

  test.todo('load by ids rejects if existing was deleted', async function() {

  });

});
