import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import Model from 'documents/document/model';

const Duck = Model.extend();

module('database-model');

test('model can be created', function(assert) {
  this.register('model:duck', Duck);
  let model = this.db.model('duck');
  assert.ok(model);
  assert.ok(Duck.detectInstance(model));
  assert.ok(model.get('store') === this.store);
  assert.ok(model.get('database') === this.db);
});
