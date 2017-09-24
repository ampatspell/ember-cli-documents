import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

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

test('array is copied when set attached', function(assert) {
  let one = this.db.doc({ things: [ { ok: true } ] });
  let two = this.db.doc({ });

  two.set('things', one.get('things'));

  assert.deepEqual(one.serialize(), {
    "things": [
      {
        "ok": true
      }
    ]
  });
  assert.deepEqual(two.serialize(), {
    "things": [
      {
        "ok": true
      }
    ]
  });

  assert.ok(two.get('things._internal'));
  assert.ok(two.get('things._internal') !== one.get('things._internal'));
  assert.ok(two.get('things.lastObject._internal') !== one.get('things.lastObject._internal'));
});

test('removed object is detached', function(assert) {
  let doc = this.db.doc({ things: [ { ok: true } ] });
  let ok = doc.get('things.lastObject');
  assert.ok(ok._internal.parent === doc.get('things._internal'));

  doc.get('things').removeObject(ok);

  assert.deepEqual(doc.get('serialized'), {
    "things": []
  });

  assert.ok(!ok._internal.parent, 'ok should not have a parent anymore');
});

test('added object has parent', function(assert) {
  let doc = this.db.doc({ things: [] });
  let obj = this.db.object({ ok: true });
  assert.ok(!obj._internal.parent);
  doc.get('things').pushObject(obj);
  assert.ok(doc.get('things.lastObject._internal') === obj._internal);
  assert.ok(obj._internal.parent === doc.get('things._internal'));
});

test('array model can be destroyed', function(assert) {
  let doc = this.db.doc({ things: [] });
  let arr = doc.get('things');
  let internal = arr._internal;

  run(() => arr.destroy());

  assert.ok(!internal._model);

  arr = doc.get('things');

  assert.ok(arr);
  assert.ok(internal._model === arr);
  assert.ok(arr._internal === internal);
});

test('array add attached', function(assert) {
  let doc = this.db.doc({ name: { first: 'Duck' }, names: [] });
  let name = doc.get('name');
  doc.get('names').pushObject(name);
  let second = doc.get('names.firstObject');
  assert.ok(name._internal !== second._internal);
  assert.deepEqual(doc.get('serialized'), {
    "name": {
      "first": "Duck"
    },
    "names": [
      {
        "first": "Duck"
      }
    ]
  });
});

test('replace array contents removes all content (needs fixing)', function(assert) {
  let doc = this.db.push({ _id: 'doc', names: [ { name: 'Duck' } ] });
  let first = doc.get('names.lastObject');
  this.db.push({ _id: 'doc', names: [ { name: 'Another' } ] });
  let second = doc.get('names.lastObject');
  assert.ok(first._internal !== second._internal);
});
