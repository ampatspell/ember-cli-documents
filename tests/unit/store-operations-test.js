import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run,
  RSVP: { Promise }
} = Ember;

module('store-operations');

test('settle', async function(assert) {
  let done = false;
  this.db.operation('random', {}, () => {
    return new Promise(resolve => {
      run.later(() => {
        done = true;
        resolve();
      }, 100);
    });
  });

  let promise = run(() => this.store.settle());

  assert.ok(!done);

  await promise;

  assert.ok(done);
});
