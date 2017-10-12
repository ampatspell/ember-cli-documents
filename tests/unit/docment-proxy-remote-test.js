import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-proxy-remote', {
  async beforeEach() {
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
    await this.recreate();
  }
});

test('proxy starts loading on isLoading', async function(assert) {
  this.owner.set('id', 'foof');

  let proxy = this.create();
  assert.ok(proxy.get('isLoading'));

  assert.ok(this.db._operations.length === 1);
  await this.db.settle();

  assert.ok(!proxy.get('isLoading'));
  assert.equal(proxy.get('error').error, 'not_found');
});

test('proxy load result appears in content', async function(assert) {
  await this.docs.save({ _id: 'duck', name: 'Yellow' });
  this.owner.set('id', 'duck');

  let proxy = this.create();
  assert.ok(proxy.get('isLoading'));

  assert.ok(this.db._operations.length === 1);
  await this.db.settle();

  assert.equal(proxy.get('name'), 'Yellow');
});
