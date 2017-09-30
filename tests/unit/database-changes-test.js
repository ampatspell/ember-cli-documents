import Ember from 'ember';
import configurations from '../helpers/configurations';
import { later } from '../helpers/run';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

configurations(module => {

  module('database-changes', {
    beforeEach() {
      return this.recreate();
    }
  });

  /*
  let changes = this.docs.createChanges({ feed: 'event-source' });
  changes.on('data', arg => {
    console.log(arg);
  });
  changes.start();
  */

  test('changes are registered', function(assert) {
    let changes = this.db.changes({ feed: this.config.feed });
    assert.ok(this.db.get('_changes').includes(changes._internal));
  });

  test('changes are destroyed with db', function(assert) {
    let changes = this.db.changes({ feed: this.config.feed });
    assert.ok(this.db.get('_changes').includes(changes._internal));

    run(() => this.db.destroy());

    assert.ok(!this.db.get('_changes').includes(changes._internal));
    assert.ok(!changes._internal._model);
  });

  test('database changes model has ref to database', function(assert) {
    let changes = this.db.changes();
    assert.ok(changes.get('database') === this.db);
  });

  test('changes has adapter', function(assert) {
    let changes = this.db.changes();
    assert.ok(changes.get('_adapter'));
    assert.ok(changes._internal._adapter);
  });

  test('adapter is destroyed with changes', function(assert) {
    let changes = this.db.changes({ feed: this.config.feed });
    let adapter = changes.get('_adapter');

    run(() => this.db.destroy());

    assert.ok(adapter.isDestroyed);
    assert.ok(!changes._internal._adapter);
  });

  test('changes has state', function(assert) {
    let changes = this.db.changes({ feed: this.config.feed });
    assert.deepEqual(changes.get('state'), {
      "error": null,
      "isError": false,
      "isStarted": false,
      "isSuspended": false
    });
  });

  test('start, suspend, stop changes', async function(assert) {
    let changes = this.db.changes({ feed: this.config.feed });

    changes.start();

    assert.deepEqual(changes.get('state'), {
      "error": null,
      "isError": false,
      "isStarted": true,
      "isSuspended": false
    });

    changes.suspend();

    assert.deepEqual(changes.get('state'), {
      "error": null,
      "isError": false,
      "isStarted": true,
      "isSuspended": true
    });

    changes.stop();

    assert.deepEqual(changes.get('state'), {
      "error": null,
      "isError": false,
      "isStarted": false,
      "isSuspended": true
    });
  });

  test('changes are pushed to db', async function(assert) {
    let events = [];
    let changes = this.db.changes({ feed: this.config.feed });

    changes.on('error', err => {
      throw err;
    });

    changes.on('change', push => {
      events.push({
        id: push.id,
        deleted: push.isDeleted,
        exists: !!push.get({ deleted: true })
      });
    });

    changes.start();

    let json = await this.docs.save({ _id: 'one' });

    await later(500);

    await this.docs.delete('one', json.rev);

    await later(500);

    assert.deepEqual(events, [
      {
        "deleted": false,
        "exists": true,
        "id": "one"
      },
      {
        "deleted": true,
        "exists": true,
        "id": "one"
      }
    ]);
  });

});
