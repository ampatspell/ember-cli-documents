import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('store');

test('store exist', function(assert) {
  assert.ok(this.store);
});

test('store has default adapter with url', function(assert) {
  let url = 'http://couch:5984';
  let store = this.stores.store({ url });
  assert.equal(store.get('_adapter.url'), url);
});

test('store has a reference to stores', function(assert) {
  assert.ok(this.stores === this.store.get('stores'));
});
