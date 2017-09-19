import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('store-database');

test('create database', function(assert) {
  let db = this.store.database('foof');
  assert.ok(db);
  assert.equal(db.get('identifier'), 'foof');
});

test('create database always returns the same db for identifier', function(assert) {
  let one = this.store.database('foofBar');
  let two = this.store.database('foofBar');
  let three = this.store.database('foof-bar');
  assert.ok(one === two);
  assert.ok(two === three);
});

test('create database returns another db for another identifier', function(assert) {
  let one = this.store.database('duck');
  let two = this.store.database('hamster');
  assert.ok(one !== two);
});

test('database is added to open databases', function(assert) {
  let dbs = this.store.get('openDatabases');
  assert.ok(!dbs.duck);
  let db = this.store.database('duck');
  assert.ok(dbs.duck === db);
});

test('database on destroy is removed from open databases', function(assert) {
  let dbs = this.store.get('openDatabases');
  let db = this.store.database('duck');
  assert.ok(dbs.duck);
  run(() => db.destroy());
  assert.ok(!dbs.duck);
});
