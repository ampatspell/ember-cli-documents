import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-dirty');

test('set property marks doc dirty', function(assert) {
  let doc = this.db.doc();
  assert.ok(!doc.get('isDirty'));
  doc.set('name', 'duck');
  assert.ok(doc.get('isDirty'));
});

test('set object marks doc dirty', function(assert) {
  let doc = this.db.doc();
  assert.ok(!doc.get('isDirty'));
  doc.set('info', { name: 'duck' });
  assert.ok(doc.get('isDirty'));
});

test('set nested property marks doc dirty', function(assert) {
  let doc = this.db.doc({ info: { name: 'untitled' } });
  assert.ok(!doc.get('isDirty'));
  doc.set('info.name', 'duck');
  assert.ok(doc.get('isDirty'));
});

test('set deeply nested property marks dirty', function(assert) {
  let doc = this.db.doc({ foo: [ { bar: { baz: [ { name: 'untitled' } ] } } ] });
  assert.ok(!doc.get('isDirty'));
  doc.set('foo.firstObject.bar.baz.firstObject.name', 'duck');
  assert.ok(doc.get('isDirty'));
});

test('push object marks dirty', function(assert) {
  let doc = this.db.doc({ info: [] });
  assert.ok(!doc.get('isDirty'));
  doc.get('info').pushObject('ok');
  assert.ok(doc.get('isDirty'));
});

test('remove object at index marks dirty', function(assert) {
  let doc = this.db.doc({ info: [ 'ok' ] });
  assert.ok(!doc.get('isDirty'));
  doc.get('info').removeAt(0);
  assert.ok(doc.get('isDirty'));
});

test('remove object marks dirty', function(assert) {
  let doc = this.db.doc({ info: [ 'ok' ] });
  assert.ok(!doc.get('isDirty'));
  doc.get('info').removeObject('ok');
  assert.ok(doc.get('isDirty'));
});
