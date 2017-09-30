import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('store-changes');

test('changes are registered', function(assert) {
  let changes = this.store.changes({ feed: this.config.feed });
  assert.ok(this.store.get('_changes').includes(changes._internal));
});

test('changes are destroyed with store', function(assert) {
  let changes = this.store.changes({ feed: this.config.feed });
  assert.ok(this.store.get('_changes').includes(changes._internal));

  run(() => this.store.destroy());

  assert.ok(!this.store.get('_changes').includes(changes._internal));
  assert.ok(!changes._internal._model);
});

test('store changes model has ref to store', function(assert) {
  let changes = this.store.changes();
  assert.ok(changes.get('store') === this.store);
});

test('changes has adapter', function(assert) {
  let changes = this.store.changes();
  assert.ok(changes.get('_adapter'));
  assert.ok(changes._internal._adapter);
});
