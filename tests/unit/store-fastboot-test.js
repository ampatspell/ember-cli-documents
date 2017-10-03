import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('store-fastboot');

const payload = {
  "databases": [
    {
      "documents": [
        {
          "_id": "one",
          "name": "Yellow"
        },
        {
          "_id": "two",
          "name": "Duck"
        }
      ],
      "identifier": "one"
    },
    {
      "documents": [
        {
          "_id": "one",
          "name": "Yellow"
        }
      ],
      "identifier": "two"
    }
  ]
};

test('serialize', function(assert) {
  let one = this.store.database('one');
  let two = this.store.database('two');
  one.push({ _id: 'one', name: 'Yellow' });
  one.push({ _id: 'two', name: 'Duck' });
  two.push({ _id: 'one', name: 'Yellow' });
  let json = this.store._serializeShoebox();
  assert.deepEqual(json, payload);
});

test('deserialize', function(assert) {
  this.store._deserializeShoebox(payload);
  assert.ok(this.store.database('one').existing('one'));
  assert.ok(this.store.database('one').existing('two'));
  assert.ok(this.store.database('two').existing('one'));
  assert.ok(!this.store.database('two').existing('two'));
});
