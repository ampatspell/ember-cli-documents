import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('database-proxy', {
  beforeEach() {
    this.owner = Ember.Object.create();
  }
});

test('create document proxy without owner and opts', async function(assert) {
  try {
    this.db.proxy('first', null, null);
    assert.ok(false);
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "query must be function"
    });
  }
});

test('create document proxy without owner', async function(assert) {
  await this.recreate();
  await this.docs.save({ _id: 'hello' });

  let proxy = this.db.proxy('first', null, {
    document: [ 'id' ],
    query() {
      return { id: 'hello' };
    },
    matches(doc) {
      return doc.get('id') === 'hello';
    }
  });

  await proxy.load();

  assert.equal(proxy.get('id'), 'hello');

  run(() => proxy.destroy());
});

test('create paginated proxy without loaded', function(assert) {
  try {
    this.db.proxy('paginated', null, {
      document: [ 'id' ],
      query() {
        return { id: 'hello' };
      },
      matches(doc) {
        return doc.get('id') === 'hello';
      }
    });
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "loaded must be function"
    });
  }
});
