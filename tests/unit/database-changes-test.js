import configurations from '../helpers/configurations';
import { test } from '../helpers/qunit';

configurations(module => {

  module('database-changes', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('changes feed without view', function(assert) {
    let changes = this.db.changes({ feed: this.config.feed, view: null });
    assert.ok(changes);
  });

});
