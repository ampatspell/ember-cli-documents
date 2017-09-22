import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-basic');

test('push fresh', function(assert) {
  let docs = this.db._documents;
  let doc = this.db.push({ _id: 'hello' });
  assert.ok(doc);
  assert.equal(doc.get('id'), 'hello');
  assert.ok(docs.all.includes(doc._internal));
  assert.ok(!docs.new.includes(doc._internal));
  assert.ok(docs.saved.hello === doc._internal);
});

test('push update to existing', function(assert) {
  let first = this.db.push({ _id: 'hello', name: 'one', old: true });

  assert.equal(first.get('name'), 'one');
  assert.equal(first.get('old'), true);

  let second = this.db.push({ _id: 'hello', name: 'two', fresh: true });

  assert.ok(first === second);
  assert.ok(first._internal === second._internal);

  assert.equal(second.get('name'), 'two');
  assert.equal(second.get('fresh'), true);
  assert.equal(second.get('old'), undefined);
});

test.skip('push update with delete', function(assert) {
  assert.ok(true);
});
