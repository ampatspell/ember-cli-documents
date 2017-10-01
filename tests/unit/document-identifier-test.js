import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-identifier');

test('id can be changed on isNew', function(assert) {
  let doc = this.db.doc({ id: 'first' });
  assert.equal(doc.get('id'), 'first');
  doc.set('id', 'second');
  assert.equal(doc.get('id'), 'second');
});

test('id cannot be changed on not new', function(assert) {
  let doc = this.db.existing('first', { create: true });
  assert.equal(doc.get('id'), 'first');
  doc.set('id', 'second');
  assert.equal(doc.get('id'), 'first');
  assert.equal(doc._internal.values.id, 'first');
});
