import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('internal-document');

test('new blank document', function(assert) {
  let doc = this.db.document();
  assert.deepEqual_(doc._internal.values, {});
});

test('new simple document', function(assert) {
  let doc = this.db.document({
    _id: 'duck:yellow',
    name: 'Yellow',
    type: 'yellow'
  });
  assert.deepEqual_(doc._internal.values, {
    _id: 'duck:yellow',
    name: 'Yellow',
    type: 'yellow'
  });
});
