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
