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
    assert.ok(this.db.get('openChanges').includes(changes));
  });

  test('changes are destroyed with db', function(assert) {
    let changes = this.db.changes({ feed: this.config.feed });
    assert.ok(this.db.get('openChanges').includes(changes));

    run(() => this.db.destroy());

    assert.ok(!this.db.get('openChanges').includes(changes));
  });

});
