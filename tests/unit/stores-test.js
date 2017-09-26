import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('stores');

test('stores exist', function(assert) {
  assert.ok(this.stores);
});

test('store is created only once', function(assert) {
  let url = 'http://127.0.0.1:5984';
  let one = this.stores.store({ url });
  let two = this.stores.store({ url });
  assert.ok(one === two);
});

test('different urls creates different stores', function(assert) {
  let one = this.stores.store({ url: 'http://server-1:5984' });
  let two = this.stores.store({ url: 'http://server-2:5984' });
  assert.ok(one !== two);
});

test('stores destory destroys stores', function(assert) {
  let url = 'http://127.0.0.1:5984';
  let store = this.stores.store({ url });
  run(() => this.stores.destroy());
  assert.ok(store.isDestroyed);
});

test('store destroy removes store from stores', function(assert) {
  let url = 'http://server:5984';
  let store = this.stores.store({ url });
  let identifier = store.get('adapter.identifier');
  assert.ok(this.stores.get('openStores')[identifier]);
  run(() => store.destroy());
  assert.ok(!this.stores.get('openStores')[identifier]);
});
