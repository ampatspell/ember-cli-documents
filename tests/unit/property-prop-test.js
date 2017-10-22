import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { first, prop } from 'documents/properties';

const {
  merge
} = Ember;

module('property-prop');

const byId = first.extend(opts => {
  opts = merge({ id: prop('id') }, opts);
  opts.id = prop.wrap(opts.id);
  return {
    owner: [ opts.id.key() ],
    document: [ 'id' ],
    query(owner) {
      let id = opts.id.value(owner);
      return { id };
    },
    matches(doc, owner) {
      return doc.get('id') === opts.id.value(owner);
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

test('property with string value', function(assert) {
  let Owner = Ember.Object.extend({
    doc: byIdWithDatabase({ database: 'db', id: 'yellow' })
  });

  let owner = Owner.create({ db: this.db });

  let opts = owner.get('doc._internal.opts');

  assert.deepEqual(opts, {
    document: [ 'id' ],
    owner: [],
    matches: opts.matches,
    query: opts.query,
  });

  assert.deepEqual(opts.query(owner), {
    id: 'yellow'
  });
});

test('property with prop', function(assert) {
  let Owner = Ember.Object.extend({
    duckId: 'yellow',
    doc: byIdWithDatabase({ database: 'db', id: prop('duckId') })
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

test('prop has a nice toString', function(assert) {
  let str;

  str = prop('foo')+'';
  assert.ok(str.includes('Property:') && str.includes(':foo'));

  str = prop.wrap('foo')+'';
  assert.ok(str.includes('Static:') && str.includes(':foo'));
});
