import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-array');

test('set array of strings', function(assert) {
  let doc = this.db.doc({ things: [ 'good', 'better', 'best' ] });
  assert.deepEqual(doc.serialize(), {
    "things": [
      "good",
      "better",
      "best"
    ]
  });
});

test('add string', function(assert) {
  let doc = this.db.doc({ things: [ 'good', 'better', 'best' ] });
  doc.get('things').pushObject('hey');
  assert.deepEqual(doc.serialize(), {
    "things": [
      "good",
      "better",
      "best",
      "hey"
    ]
  });
});

test('set array of objects', function(assert) {
  let doc = this.db.doc({
    things: [
      { type: 'text', id: 'foo' },
      { type: 'image', id: 'bar' }
    ]
  });
  assert.deepEqual(doc.serialize(), {
    "things": [
      {
        "id": "foo",
        "type": "text"
      },
      {
        "id": "bar",
        "type": "image"
      }
    ]
  });
});

test('add object to array', function(assert) {
  let doc = this.db.doc({
    things: [
      { type: 'text', id: 'foo' }
    ]
  });
  doc.get('things').pushObject({ type: 'image', id: 'bar' });
  assert.deepEqual(doc.serialize(), {
    "things": [
      {
        "id": "foo",
        "type": "text"
      },
      {
        "id": "bar",
        "type": "image"
      }
    ]
  });
  let obj = doc.get('things.lastObject');
  assert.equal(obj.get('id'), 'bar');
  assert.ok(obj._internal.parent === doc.get('things._internal'));
});

test('crate detached array and attach', function(assert) {
  let obj = this.db.object({ ok: true });
  let arr = this.db.array([ obj ]);
  let doc = this.db.doc({ arr });
  assert.deepEqual(doc.serialize(), {
    "arr": [
      {
        "ok": true
      }
    ]
  });
  assert.ok(arr._internal.values[0] === obj._internal);
  assert.ok(doc._internal.values.arr === arr._internal);
});

// test('attach array', function(assert) {
// });

// test('copy arary', function(assert) {
// });
