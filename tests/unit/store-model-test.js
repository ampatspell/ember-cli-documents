import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const Duck = Ember.Object.extend({
});

module('store-model', {
  beforeEach() {
  }
});

test('model can be created', function(assert) {
  this.register('model:duck', Duck);
  let model = this.store.model('duck');
  assert.ok(model);
  assert.ok(Duck.detectInstance(model));
  assert.ok(model.get('store') === this.store);
});

test('model not registered', function(assert) {
  try {
    this.store.model('duck');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model for name 'duck' is not registered"
    });
  }
});

test('name must be string', function(assert) {
  try {
    this.store.model({});
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model name must be string"
    });
  }
});

test('name must not be blank', function(assert) {
  try {
    this.store.model('');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model name must not be blank"
    });
  }
});
