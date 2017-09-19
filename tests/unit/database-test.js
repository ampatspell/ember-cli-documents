import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('database');

test('database exist', function(assert) {
  assert.ok(this.db);
});
