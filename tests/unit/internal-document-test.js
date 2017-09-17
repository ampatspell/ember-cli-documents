import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('internal-document');

test('new blank document', function(assert) {
  let doc = this.db.document();
  assert.deepEqual_(doc._internal.values, {});
});

test('new simple document', function(assert) {
  let doc = this.db.document({
    _id: 'duck:yellow',
    name: 'Yellow',
    type: 'yellow'
  });
  assert.deepEqual_(doc._internal.values, {
    _id: 'duck:yellow',
    name: 'Yellow',
    type: 'yellow'
  });
  assert.equal(doc.get('name'), 'Yellow');
  assert.equal(doc.get('type'), 'yellow');
});

test('new document with object', function(assert) {
  let doc = this.db.document({
    address: { city: 'Yello', country: 'Duckland' }
  });
  assert.ok(doc.get('address._internal'));
  assert.equal(doc.get('address.city'), 'Yello');
  assert.equal(doc.get('address.country'), 'Duckland');
});

test('replace object', function(assert) {
  let doc = this.db.document({
    address: { city: 'Yello', country: 'Duckland' }
  });

  let address = doc.get('address');
  let addressInternal = address._internal;
  assert.ok(addressInternal.parent === doc._internal);

  doc.set('address.city', 'Yellow');
  assert.equal(doc.get('address.city'), 'Yellow');

  doc.set('address', { city: 'Red' });
  assert.equal(doc.get('address.city'), 'Red');
  assert.equal(doc.get('address.country'), undefined);

  assert.ok(doc.get('address') === address);
  assert.ok(doc.get('address._internal') === addressInternal);

  doc.set('address', 'foof');
  assert.equal(doc.get('address'), 'foof');
  assert.ok(!addressInternal.parent);
});

test('serialize doc with object', function(assert) {
  let doc = this.db.document({
    _id: 'duck:yellow',
    address: { city: 'Yello', country: 'Duckland' }
  });
  assert.deepEqual(doc.get('serialized'), {
    "_id": "duck:yellow",
    "address": {
      "city": "Yello",
      "country": "Duckland"
    }
  });
});

test('update object notifies doc change', function(assert) {
  let doc = this.db.document({
    _id: 'duck:yellow',
    shipping: {
      address: { city: 'Yello', country: 'Duckland' }
    }
  });

  assert.deepEqual(doc.get('serialized'), {
    "_id": "duck:yellow",
    "shipping": {
      "address": {
        "city": "Yello",
        "country": "Duckland"
      }
    }
  });

  doc.set('shipping.address.city', 'Yellow');

  assert.deepEqual(doc.get('serialized'), {
    "_id": "duck:yellow",
    "shipping": {
      "address": {
        "city": "Yellow",
        "country": "Duckland"
      }
    }
  });

  doc.set('shipping', { ok: true });

  assert.deepEqual(doc.get('serialized'), {
    "_id": "duck:yellow",
    "shipping": {
      "ok": true
    }
  });
});

test('set array with objects', function(assert) {
  let doc = this.db.document({
    _id: 'duck:yellow',
    stuff: [
      { city: 'Yello', country: 'Duckland' },
      'hey',
      [
        { ok: true }
      ]
    ]
  });
  assert.deepEqual(doc.serialize(), {
    _id: 'duck:yellow',
    stuff: [
      { city: 'Yello', country: 'Duckland' },
      'hey',
      [
        { ok: true }
      ]
    ]
  });
});
