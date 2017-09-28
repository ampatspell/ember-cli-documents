import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-underscore-camelize');

let model = {
  id: 'thing',
  firstName: 'Duck',
  lastName: 'Yellow',
  fullAddress: {
    country: 'Latvia',
    streetName: 'Yellow str',
    addressComponents: [
      {
        roomNumber: {
          numberValue: '1'
        }
      }
    ]
  }
};

let doc = {
  "_id": "thing",
  "first_name": "Duck",
  "full_address": {
    "address_components": [
      {
        "room_number": {
          "number_value": "1"
        }
      }
    ],
    "country": "Latvia",
    "street_name": "Yellow str"
  },
  "last_name": "Yellow"
};

test('serialize', function(assert) {
  let instance = this.db.doc(model);
  assert.deepEqual(instance.serialize('model'), model);
  assert.deepEqual(instance.serialize('document'), doc);
});

test('deserialize', function(assert) {
  let instance = this.db.push(doc);
  assert.deepEqual(instance.serialize('model'), model);
});
