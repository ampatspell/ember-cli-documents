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

test('proxy does not notify isLoading change from doc', async function(assert) {
  await this.recreate();
  await this.docs.save({ _id: 'thing' });
  this.opts.autoload = false;

  this.owner.set('id', 'thing');
  let proxy = this.create();

  let log = [];

  proxy.addObserver('isLoading', () => {
    log.push([ 'proxy', proxy.get('isLoading') ]);
  });

  assert.ok(!proxy.get('content'));
  let thing = this.db.existing('thing', { create: true });
  assert.ok(proxy.get('content'));

  thing.addObserver('isLoading', () => {
    log.push([ 'thing', thing.get('isLoading') ]);
  });

  await thing.load();

  assert.deepEqual(log, [
    [ "thing", true ],
    [ "thing", false ]
  ]);

  log = [];

  await proxy.load();

  assert.deepEqual(log, [
    [ "proxy", true ],
    [ "proxy", false ]
  ]);

  run(() => proxy.destroy());
});
