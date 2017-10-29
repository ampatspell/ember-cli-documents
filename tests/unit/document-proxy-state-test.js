import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('document-proxy-state', {
  beforeEach() {
    this.owner = Ember.Object.create({ id: null });
    this.opts = {
      owner: [ 'id' ],
      document: [ 'id' ],
      matches(doc, owner) {
        return doc.get('id') === owner.get('id');
      },
      query(owner) {
        let id = owner.get('id');
        return { id };
      }
    };
    this.create = () => this.db._createInternalDocumentProxy(this.owner, this.opts).model(true);
  }
});

test.skip('notify property change', async function(assert) {
  await this.recreate();
  await this.docs.save({ _id: 'thing' });
  this.opts.autoload = false;

  this.owner.set('id', 'thing');
  let proxy = this.create();

  proxy.get('isLoading');

  proxy.addObserver('isLoading', () => {
    // console.log('proxy.isLoading', proxy.get('isLoading'));
  });

  assert.ok(!proxy.get('content'));
  let thing = this.db.existing('thing', { create: true });
  assert.ok(proxy.get('content'));

  thing.addObserver('isLoading', () => {
    // console.log('thing.isLoading', thing.get('isLoading'));
  });

  await thing.load();

  run(() => proxy.destroy());
});
