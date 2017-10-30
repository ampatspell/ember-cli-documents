import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { getDefinition, prop } from 'documents/properties';
import byIds from 'documents/properties/find-by-ids';
import { pick } from 'documents/util/object';

const {
  A,
  run,
  RSVP: { all }
} = Ember;

module('property-by-ids', {
  beforeEach() {
    this.settle = proxy => proxy._internal.loader(true).settle();
  }
});

test('build', function(assert) {
  let Owner = Ember.Object.extend({
    duckIds: [ 'yellow' ],
    doc: byIds({ database: 'db', ids: prop('duckIds') })
  });

  let owner = Owner.create({ db: this.db });
  let opts = getDefinition(owner, 'doc');

  assert.deepEqual(pick(opts, ['database', 'owner', 'document']), {
    database: 'db',
    owner: [ 'duckIds.[]' ],
    document: [ 'id' ]
  });

  assert.ok(!opts.matches(Ember.Object.create({ id: 'green' }), owner));
  assert.ok(opts.matches(Ember.Object.create({ id: 'yellow' }), owner));

  assert.deepEqual(opts.query(owner), {
    all: true,
    keys: [ 'yellow' ]
  });
});

test('load', async function(assert) {
  await this.recreate();
  await all([
    this.docs.save({ _id: 'yellow' }),
    this.docs.save({ _id: 'green' })
  ]);

  let Owner = Ember.Object.extend({
    duckIds: A([]),
    docs: byIds({ database: 'db', ids: prop('duckIds') })
  });

  let owner = Owner.create({ db: this.db });
  let proxy = owner.get('docs');

  assert.equal(proxy._internal.loader(true).state.isLoaded, false);
  assert.equal(proxy._internal.loader(true).state.isLoading, false);

  assert.equal(proxy.get('isLoading'), false);
  assert.equal(proxy.get('length'), 0);

  owner.get('duckIds').pushObject('yellow');

  assert.equal(proxy._internal.loader(true).state.isLoading, false);
  assert.equal(proxy.get('isLoading'), true);
  await this.settle(proxy);

  owner.get('duckIds').pushObject('green');

  assert.equal(proxy._internal.loader(true).state.isLoading, false);
  assert.equal(proxy.get('isLoading'), true);
  await this.settle(proxy);

  assert.deepEqual(proxy.mapBy('id'), [ 'yellow', 'green' ]);

  run(() => owner.destroy());
});

test('manual load', async function(assert) {
  await this.recreate();
  await all([
    this.docs.save({ _id: 'yellow' }),
    this.docs.save({ _id: 'green' })
  ]);

  let Owner = Ember.Object.extend({
    duckIds: A([ 'green', 'yellow' ]),
    docs: byIds({ database: 'db', ids: prop('duckIds'), autoload: false })
  });

  let owner = Owner.create({ db: this.db });
  let proxy = owner.get('docs');

  let result = await proxy.load();
  assert.ok(result === proxy);

  assert.deepEqual(proxy.mapBy('id'), [ 'green', 'yellow' ]);

  run(() => owner.destroy());
});
