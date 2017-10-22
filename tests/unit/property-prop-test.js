import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { first } from 'documents/properties';

const {
  run,
  merge
} = Ember;

module('property-prop');

const byId = first.extend(opts => {
  opts = merge({ id: 'id' }, opts);
  return {
    owner: [ opts.id ],
    document: [ 'id' ],
    query(owner) {
      let id = owner.get(opts.id);
      return { id };
    },
    matches(doc, owner) {
      return doc.get('id') === owner.get(opts.id);
    }
  }
});

const withDatabaseMixin = extendable => extendable.extend(opts => {
  opts = merge({ database: 'database' }, opts);
  let { database } = opts;
  return {
    database
  };
});

const byIdWithDatabase = withDatabaseMixin(byId);

test('property with value', function(assert) {
  let Owner = Ember.Object.extend({
    duckId: 'yellow',
    doc: byIdWithDatabase({ database: 'db', id: 'duckId' })
  });

  let owner = Owner.create({ db: this.db });

  let opts = owner.get('doc._internal.opts');

  assert.deepEqual(opts, {
    document: [ 'id' ],
    owner: [ 'duckId' ],
    matches: opts.matches,
    query: opts.query,
  });

  assert.deepEqual(opts.query(owner), {
    id: 'yellow'
  });
});
