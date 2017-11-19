import { run } from '@ember/runloop';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import Model from 'documents/document/model';

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
  let identifier = store.get('_adapter.identifier');
  assert.ok(this.stores._stores.keyed[identifier]);
  run(() => store.destroy());
  assert.ok(!this.stores._stores.keyed[identifier]);
});

test('stores destory destroys documents identity', function(assert) {
  let identity = this.stores.get('documentsIdentity');
  run(() => this.stores.destroy());
  assert.ok(identity.isDestroyed);
});

test('stores destory destroys models identity', function(assert) {
  let Thing = Model.extend();
  this.register('model:thing', Thing);
  let url = 'http://127.0.0.1:5984';
  let store = this.stores.store({ url });
  let model = store.model('thing');
  let identity = this.stores.get('modelsIdentity');
  assert.equal(identity.modelsByClass(Thing).get('length'), 1);
  run(() => this.stores.destroy());
  assert.ok(identity.isDestroyed);
  assert.ok(model.isDestroyed);
});
