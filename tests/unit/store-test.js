import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('store');

test('store exist', function(assert) {
  assert.ok(this.store);
});

test('store has default adapter with url', function(assert) {
  let store = this.stores.store('default');
  let url = store.get('_adapter.url');
  assert.equal(url, this.config.store.url);
});

test('store has a reference to stores', function(assert) {
  assert.ok(this.stores === this.store.get('stores'));
});
