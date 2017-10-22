import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { first } from 'documents/properties';

const {
  run,
} = Ember;

module('property-prop');

const byId = first.extend(opts => {
  let { id } = opts;
  return {
    database: 'db',
    query() {
    },
    matches() {
    }
  }
});

test.skip('property prop', function(assert) {
  let Owner = Ember.Object.extend({
    doc: byId({ id: 'duck' })
  });

  let owner = Owner.create({ db: this.db });
  assert.deepEqual(owner.get('doc._internal.opts'), {});
});
