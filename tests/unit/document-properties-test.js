import module from '../helpers/module-for-db';
import { test } from 'ember-qunit';

module('document properties');

test('push primitives', function(assert) {
  let doc = this.db.push({ _id: 'duck:yellow', name: 'yellow' });
  assert.ok(doc);
  assert.equal(doc.get('id'), 'duck:yellow');
  assert.equal(doc.get('name'), 'yellow');
});
