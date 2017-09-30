import configurations from '../helpers/configurations';
import { later } from '../helpers/run';
import { test } from '../helpers/qunit';

configurations(module => {

  module('store-changes-remote', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('thing', async function(assert) {
    await this.admin();

    let events = [];
    let changes = this.store.changes({ feed: this.config.feed });

    changes.on('error', err => {
      throw err;
    });

    changes.on('change', json => {
      if(json.name === '_dbs') {
        return;
      }
      events.push(json);
    });

    changes.start();
    await later(300);

    await this.docs.get('couch.db.ember-cli-documents-changes.database').create();
    await later(300);

    await this.docs.get('couch.db.ember-cli-documents-changes.database').delete();
    await later(300);

    assert.deepEqual(events, [
      {
        "name": "ember-cli-documents-changes",
        "type": "created"
      },
      {
        "name": "ember-cli-documents-changes",
        "type": "deleted"
      }
    ]);

    await this.docs.get('couch.db.ember-cli-documents-random.database').create();
    await this.docs.get('couch.db.ember-cli-documents-random.database').delete();
  });

});
