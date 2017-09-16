import module from '../helpers/module-for-db';
import { test } from 'ember-qunit';

module('internal-document');

test('create new complex', function(assert) {
  let doc = this.db.document({
    _id: 'duck:yellow',
    name: 'Yellow',
    type: 'yellow',
    address: {
      street: 'Yellow str'
    }
  });
  assert.ok(doc);
  assert.deepEqual(doc.state.values, {
    "error": null,
    "isDeleted": false,
    "isDirty": false,
    "isError": false,
    "isLoaded": false,
    "isLoading": false,
    "isNew": true,
    "isSaving": false
  });
  assert.deepEqual(doc.serialize(), {
    _id: 'duck:yellow',
    name: 'Yellow',
    type: 'yellow',
    address: {
      street: 'Yellow str'
    }
  });
});
