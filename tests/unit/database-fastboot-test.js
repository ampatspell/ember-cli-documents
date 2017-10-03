import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('database-fastboot');

test('serialize', function(assert) {
  this.db.push({ _id: 'one', name: 'Yellow' });
  this.db.push({ _id: 'two', name: 'Duck' });
  this.db.doc({ id: 'three', name: 'Hamster' });
  let payload = this.db._serializeShoebox();
  assert.deepEqual(payload, {
    identifier: "ember-cli-documents",
    documents: [
      {
        "_id": "one",
        "name": "Yellow"
      },
      {
        "_id": "two",
        "name": "Duck"
      }
    ]
  });
});

test('deserialize', function(assert) {
  this.db._deserializeShoebox({
    documents: [
      {
        "_id": "one",
        "name": "Yellow"
      },
      {
        "_id": "two",
        "name": "Duck"
      }
    ]
  });
  assert.ok(this.db.existing('one'));
  assert.ok(this.db.existing('two'));
});
