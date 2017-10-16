import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  merge
} = Ember;

module('store-database-name-mapping', {
  beforeEach() {
    let databaseNameForIdentifier = identifier => {
      if(identifier === 'main') {
        return 'ember-cli-documents';
      }
    };
    let config = merge({ databaseNameForIdentifier }, this.config.store);
    this._store = this.stores.store(config);
  }
});

test('lookup by identifier', function(assert) {
  let db = this._store.database('main');
  assert.equal(db.get('identifier'), 'main');
  assert.equal(db.get('name'), 'ember-cli-documents');
  assert.equal(db.get('documents.name'), 'ember-cli-documents');
});

test('invalid identifier', function(assert) {
  try {
    this._store.database('foof');
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "database name must be string"
    });
  }
});
