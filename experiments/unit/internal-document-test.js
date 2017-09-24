import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('internal-document');

test('set array with objects', function(assert) {
  let doc = this.db.doc({
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

test('replace array', function(assert) {
  let doc = this.db.doc({
    things: [
      { id: 'a' },
      { id: 'b' },
    ]
  });

  assert.deepEqual(doc.serialize(), {
    "things": [
      { id: 'a' },
      { id: 'b' },
    ]
  });

  assert.deepEqual(doc.get('serialized'), {
    "things": [
      { id: 'a' },
      { id: 'b' },
    ]
  });

  doc.get('things')._internal._deserialize([
    { id: 'c' },
    { id: 'a' },
  ]);

  assert.deepEqual(doc.serialize(), {
    "things": [
      { id: 'c' },
      { id: 'a' }
    ]
  });

  assert.deepEqual(doc.get('serialized'), {
    "things": [
      { id: 'c' },
      { id: 'a' }
    ]
  });
});

test('document id', function(assert) {
  let doc = this.db.doc({ _id: 'hello' });
  assert.equal(doc.get('id'), 'hello');
  assert.equal(doc.get('_id'), undefined);

  doc.set('id', 'another');
  assert.equal(doc.get('id'), 'another');
  assert.equal(doc.get('_id'), undefined);
});

test('document rev', function(assert) {
  let doc = this.db.doc({ _rev: '1-asd' });
  assert.equal(doc.get('rev'), '1-asd');
  assert.equal(doc.get('_rev'), undefined);

  doc._internal.deserialize({ _rev: '2-asd' });
  assert.equal(doc.get('rev'), '2-asd');
  assert.equal(doc.get('_rev'), undefined);

  doc._internal._setValueNotify('_rev', '3-asd');
  assert.equal(doc.get('rev'), '3-asd');
  assert.equal(doc.get('_rev'), undefined);
});

test('create array and attach to document', function(assert) {
  let array = this.db.array([ { ok: true } ]);
  assert.ok(array._internal);
  assert.ok(!array._internal.parent);
  assert.equal(array.get('length'), 1);
  let ok = array.objectAt(0);

  let doc = this.db.doc();
  doc.set('array', array);
  assert.ok(doc.get('array')._internal.parent === doc._internal);
  assert.ok(doc.get('array') === array);
  assert.ok(doc.get('array.lastObject') === ok);
});

test('create object and attach to array', function(assert) {
  let doc = this.db.doc();
  let array = this.db.array();
  let ok = this.db.object({ ok: true });

  array.pushObject(ok);
  assert.ok(array.objectAt(0)._internal === ok._internal);
  assert.ok(ok._internal.parent === array._internal);

  doc.set('array', array);
  assert.ok(array._internal.parent === doc._internal);

  doc.set('object', ok);
  assert.ok(doc.get('object') !== ok);
  assert.ok(doc.get('object')._internal !== ok._internal);

  assert.deepEqual_(doc.get('serialized'), {
    "array": [
      {
        "ok": true
      }
    ],
    "object": {
      "ok": true
    }
  });
});
