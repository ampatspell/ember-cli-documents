import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { getDefinition, prop } from 'documents/properties';
import byId from 'documents/properties/first-by-id';
import { pick } from 'documents/util/object';

module('property-by-id');

test('id prop', function(assert) {
  let Owner = Ember.Object.extend({
    duckId: 'duck',
    doc: byId({ database: 'db', id: prop('duckId') })
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
