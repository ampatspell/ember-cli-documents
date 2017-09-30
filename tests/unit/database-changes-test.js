import Ember from 'ember';
import configurations from '../helpers/configurations';
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

});
