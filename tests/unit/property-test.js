import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import docById from 'documents/properties/experimental/doc-by-id';

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
