import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run,
  RSVP: { all }
} = Ember;

module('query-loader', {
  async beforeEach() {
    this.owner = Ember.Object.create({ id: null });
    this.opts = {
      owner: [ 'id' ],
      query(owner) {
        let id = owner.get('id');
        return { id };
      }
    };
    this.parent = {
      withPropertyChanges() {}
    };
    this.first = () => this.db._createInternalQueryLoader(this.parent, this.owner, this.opts, 'first').model(true);
    this.settle = loader => loader._internal.settle();
  }
});

test('it exists', function(assert) {
  this.opts.autoload = false;

  let loader = this.first();
  assert.ok(loader);
  run(() => loader.destroy());
});

test('loader has query', function(assert) {
  this.opts.autoload = false;

  this.owner.set('id', 'duck');
  let loader = this.first();
  assert.deepEqual(loader._internal.query, {
    "id": "duck"
  });
  run(() => loader.destroy());
});

test('load succeeds', async function(assert) {
  await this.recreate();

  this.opts.autoload = false;

  await this.docs.save({ _id: 'duck' });
  this.owner.set('id', 'duck');

  let loader = this.first();
  assert.ok(!loader.get('isLoading'));

  let promise = loader.load();
  assert.ok(loader.get('isLoading'));

  let result = await promise;
  assert.ok(result === loader);
  assert.ok(this.db.existing('duck'));

  run(() => loader.destroy());
});

test('load fails', async function(assert) {
  await this.recreate();

  this.opts.autoload = false;

  this.owner.set('id', 'duck');
  let loader = this.first();

  try {
    await loader.load();
  } catch(err) {
    assert.equal(err.error, 'not_found');
  }

  assert.equal(loader._internal.state.error.error, 'not_found');

  run(() => loader.destroy());
});

test('two loads. second returns 1st promise', async function(assert) {
  await this.recreate();

  this.opts.autoload = false;

  await this.docs.save({ _id: 'duck' });
  this.owner.set('id', 'duck');

  let loader = this.first();

  let one = loader._internal.reload();
  let two = loader._internal.reload();

  await all([ one, two ]);

  assert.ok(this.db.existing('duck'));
  assert.ok(one === two);

  run(() => loader.destroy());
});

test('destroy while loading', async function(assert) {
  await this.recreate();

  this.opts.autoload = false;
  await this.docs.save({ _id: 'duck' });
  this.owner.set('id', 'duck');

  let loader = this.first();
  let promise = loader._internal.reload();

  run(() => loader.destroy());

  await promise;

  assert.ok(loader._internal.state.isLoaded);
});

test('autoload for isLoading, isLoaded', async function(assert) {
  await this.recreate();

  await this.docs.save({ _id: 'duck' });
  this.owner.set('id', 'duck');
  let loader = this.first();

  assert.equal(loader._internal.state.isLoading, false);
  assert.equal(loader.get('isLoading'), true);
  assert.equal(loader._internal.state.isLoading, true);
  assert.equal(loader._internal.operations.get('length'), 1);

  assert.equal(loader.get('isLoading'), true);
  assert.equal(loader.get('isLoaded'), false);
  assert.equal(loader._internal.operations.get('length'), 1);

  await this.settle(loader);
});

test('autoload and force load', async function(assert) {
  await this.recreate();

  await this.docs.save({ _id: 'duck' });
  this.owner.set('id', 'duck');
  let loader = this.first();

  assert.equal(loader._internal.state.isLoading, false);
  assert.equal(loader.get('isLoading'), true);
  assert.equal(loader._internal.state.isLoading, true);
  assert.equal(loader._internal.operations.get('length'), 1);

  loader.reload();
  assert.equal(loader._internal.operations.get('length'), 1);

  await this.settle(loader);
});

test('load and force load', async function(assert) {
  await this.recreate();

  await this.docs.save({ _id: 'duck' });
  this.owner.set('id', 'duck');
  let loader = this.first();

  loader.load();
  assert.equal(loader._internal.operations.get('length'), 1);

  loader.reload();
  assert.equal(loader._internal.operations.get('length'), 1);

  loader.reload();
  assert.equal(loader._internal.operations.get('length'), 1);

  await this.settle(loader);
});

test('load on owner property change', async function(assert) {
  await this.recreate();

  await this.docs.save({ _id: 'duck' });
  let loader = this.first();

  assert.equal(loader._internal.operations.get('length'), 0);

  this.owner.set('id', 'du');
  assert.equal(loader._internal.operations.get('length'), 1);

  this.owner.set('id', 'duc');
  assert.equal(loader._internal.operations.get('length'), 2);

  this.owner.set('id', 'duck');
  assert.equal(loader._internal.operations.get('length'), 3);

  await this.settle(loader);

  assert.ok(this.db.existing('duck'));
});
