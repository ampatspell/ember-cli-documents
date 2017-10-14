import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('paginated-loader', {
  async beforeEach() {
    this.owner = Ember.Object.create({ id: null });
    this.opts = {
      owner: [ 'id' ],
      query(owner) {
        let id = owner.get('id');
        return { id };
      }
    };
    this.loader = () => this.db._createInternalPaginatedLoader(this.owner, this.opts).model(true);
    this.settle = loader => loader.settle();
  }
});

test('it exists', function(assert) {
  this.opts.autoload = false;

  let loader = this.loader();
  assert.ok(loader);

  run(() => loader.destroy());
});

test.skip('paginated loader actually does something', function() {});
