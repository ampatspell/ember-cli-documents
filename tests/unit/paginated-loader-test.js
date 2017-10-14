import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run,
  RSVP: { allSettled }
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
    this.settle = loader => allSettled(loader._internal.operations.map(op => op.promise));
  }
});

test('it exists', function(assert) {
  this.opts.autoload = false;

  let loader = this.loader();
  assert.ok(loader);

  console.log(loader);

  // run(() => loader.destroy());
});
