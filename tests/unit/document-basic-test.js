import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-basic');

test('document has an id', function(assert) {
  let doc = this.db.doc({ _id: 'hello' });
  assert.equal(doc.get('id'), 'hello');
});

test('document allows setting id', function(assert) {
  let doc = this.db.doc();
  assert.equal(doc.set('id', 'hello'), 'hello');
  assert.equal(doc.get('id'), 'hello');
});

test('document has a rev', function(assert) {
  let doc = this.db.doc({ _rev: '1-hello' });
  assert.equal(doc.get('rev'), '1-hello');
});

test('document has a reference to database', function(assert) {
  let doc = this.db.doc();
  assert.ok(doc.get('database') === this.db);
});

test('document serialize', function(assert) {
  let doc = this.db.doc({ _id: 'duck:yellow', _rev: '1-asd', type: 'duck', name: 'Yellow' });
  assert.deepEqual(doc.serialize({ type: 'document' }), {
    "_id": "duck:yellow",
    "_rev": "1-asd",
    "name": "Yellow",
    "type": "duck"
  });
});

test('document serialized', function(assert) {
  let doc = this.db.doc({ _id: 'duck:yellow', _rev: '1-asd', type: 'duck', name: 'Yellow' });

  assert.deepEqual(doc.get('serialized'), {
    "_id": "duck:yellow",
    "_rev": "1-asd",
    "name": "Yellow",
    "type": "duck"
  });
});

test('document serialized property change is notified', function(assert) {
  let doc = this.db.doc({ _id: 'duck:yellow', _rev: '1-asd', type: 'duck', name: 'Yellow' });
  assert.equal(doc.get('serialized').name, 'Yellow');
  doc.set('name', 'Another');
  assert.equal(doc.get('serialized').name, 'Another');
});

test('document set and get property', function(assert) {
  let doc = this.db.doc({ _id: 'duck:yellow', _rev: '1-asd', type: 'duck', name: 'Yellow' });
  assert.equal(doc.get('name'), 'Yellow');
  doc.set('name', 'Another');
  assert.equal(doc.get('name'), 'Another');
});

test('document set undefined removes value', function(assert) {
  let doc = this.db.doc({ _id: 'duck:yellow', _rev: '1-asd', type: 'duck', name: 'Yellow' });
  assert.equal(doc.get('name'), 'Yellow');
  doc.set('name', undefined);
  assert.equal(doc.get('name'), undefined);
  assert.ok(!Object.hasOwnProperty(doc.serialize(), 'name'));
});

test('attempt to set _id and _rev directly is ignored', function(assert) {
  let doc = this.db.doc();

  doc.set('_id', 'qwe');
  assert.ok(!doc.get('id'));

  doc.set('_rev', 'qwe');
  assert.ok(!doc.get('rev'));
});

test('get _id and _rev are ignored', function(assert) {
  let doc = this.db.doc({ _id: 'one', _rev: '1-one' });
  assert.ok(!doc.get('_id'));
  assert.ok(!doc.get('_rev'));
});

test.skip('init document with id', function(assert) {
  let doc = this.db.doc({ id: 'asd', rev: '1-skip', _rev: '1-skip' });
  assert.deepEqual(doc._internal.values, {
    _id: 'asd'
  });
  assert.deepEqual(doc.serialize({ type: 'preview' }), {
    _id: 'asd'
  });
});
