import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('loader', {
  async beforeEach() {
    this.owner = Ember.Object.create({ id: null });
    this.opts = {
      owner: [ 'id' ],
      query(owner) {
        let id = owner.get('id');
        return { id };
      }
    };
    this.first = () => this.db._createInternalLoader(this.owner, this.opts, 'first').model(true);
    await this.recreate();
  }
});

test('it exists', function(assert) {
  let loader = this.first();
  assert.ok(loader);
  run(() => loader.destroy());
});

test('loader has query', function(assert) {
  this.owner.set('id', 'duck');
  let loader = this.first();
  assert.deepEqual(loader._internal.query, {
    "id": "duck"
  });
  run(() => loader.destroy());
});

test('load succeeds', async function(assert) {
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
