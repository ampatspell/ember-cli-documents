import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const Duck = Ember.Object.extend({
});

module('database-model', {
  beforeEach() {
  }
});

test('model can be created', function(assert) {
  this.register('model:duck', Duck);
  let model = this.db.model('duck');
  assert.ok(model);
  assert.ok(Duck.detectInstance(model));
  assert.ok(model.get('store') === this.store);
  assert.ok(model.get('database') === this.db);
});
