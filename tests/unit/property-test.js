import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import docById from 'documents/properties/by-id';
import { getDefinition } from 'documents/properties/proxy';

const {
  run,
} = Ember;

module('property');

test('property destroys proxy', function(assert) {
  let Owner = Ember.Object.extend({
    id: 'duck',
    doc: docById({ database: 'db', id: 'id' })
  });

  let owner = Owner.create({ db: this.db });

  let proxy = owner.get('doc');
  assert.ok(proxy);

  run(() => owner.destroy());

  assert.ok(proxy.isDestroyed);
});

test('property has definition meta', function(assert) {
  let Owner = Ember.Object.extend({
    id: 'duck',
    doc: docById({ database: 'db', id: 'id' })
  });

  let classDef = getDefinition(Owner, 'doc');
  assert.equal(classDef.database, 'db');

  let owner = Owner.create();
  let instanceDef = getDefinition(owner, 'doc');
  assert.equal(instanceDef.database, 'db');
});
