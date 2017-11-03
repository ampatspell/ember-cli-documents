import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import Model from 'documents/document/model';

const {
  run
} = Ember;

const State = Model.extend();
const Duck = Model.extend();

module('model', {
  beforeEach() {
    this.register('model:state', State);
    this.register('model:duck', Duck);
  }
});

test('create child model has parent, inherits database', function(assert) {
  let state = this.store.model('state', { database: this.db });
  assert.ok(state.get('store') === this.store);
  let duck = state.model('duck');
  assert.ok(duck.get('store') === this.store);
  assert.ok(duck.get('database') === this.db);
  assert.ok(duck);
  assert.ok(duck._internal.parent === state._internal);
});

test('destroy parent model destroys childs', function(assert) {
  let state = this.store.model('state', { database: this.db });
  let duck = state.model('duck');
  run(() => state.destroy());
  assert.ok(duck.isDestroying);
});

test('destroy child remove it from parent', function(assert) {
  let state = this.store.model('state', { database: this.db });
  let duck = state.model('duck');
  assert.ok(state._internal.models()[0] === duck._internal);
  run(() => duck.destroy());
  assert.ok(state._internal.models()[0] === undefined);
});
