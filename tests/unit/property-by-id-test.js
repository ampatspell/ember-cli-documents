import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { getDefinition, prop } from 'documents/properties';
import byId from 'documents/properties/first-by-id';
import isNewMixin from 'documents/properties/is-new-mixin';
import createDefaultsMixin from 'documents/properties/create-defaults-mixin';
import { pick } from 'documents/util/object';

const databaseMixin = createDefaultsMixin({ database: 'db' });
const byIdWithDatabase = databaseMixin(byId);
const isNewById = isNewMixin(byIdWithDatabase);

module('property-by-id');

test('plain', function(assert) {
  let Owner = Ember.Object.extend({
    duckId: 'duck',
    doc: byIdWithDatabase({ id: prop('duckId') })
  });

  let owner = Owner.create({ db: this.db });
  let opts = getDefinition(owner, 'doc');

  assert.deepEqual(pick(opts, ['database', 'owner', 'document']), {
    database: 'db',
    owner: [ 'duckId' ],
    document: [ 'id' ]
  });

  assert.ok(!opts.matches(Ember.Object.create({ id: 'rabbit' }), owner));
  assert.ok(opts.matches(Ember.Object.create({ id: 'duck' }), owner));

  assert.deepEqual(opts.query(owner), {
    id: 'duck'
  });
});

test('isNew mixin', function(assert) {
  let Owner = Ember.Object.extend({
    duckId: 'duck',
    isNew: null,
    doc: isNewById({ id: prop('duckId'), new: prop('isNew') })
  });

  let owner = Owner.create({ db: this.db });
  let opts = getDefinition(owner, 'doc');

  assert.ok(opts.matches(Ember.Object.create({ id: 'duck', isNew: false }), owner));
  assert.ok(opts.matches(Ember.Object.create({ id: 'duck', isNew: true }), owner));

  owner.set('isNew', undefined);

  assert.ok(opts.matches(Ember.Object.create({ id: 'duck', isNew: false }), owner));
  assert.ok(opts.matches(Ember.Object.create({ id: 'duck', isNew: true }), owner));

  owner.set('isNew', false);

  assert.ok(opts.matches(Ember.Object.create({ id: 'duck', isNew: false }), owner));
  assert.ok(!opts.matches(Ember.Object.create({ id: 'duck', isNew: true }), owner));

  owner.set('isNew', true);

  assert.ok(!opts.matches(Ember.Object.create({ id: 'duck', isNew: false }), owner));
  assert.ok(opts.matches(Ember.Object.create({ id: 'duck', isNew: true }), owner));
});
