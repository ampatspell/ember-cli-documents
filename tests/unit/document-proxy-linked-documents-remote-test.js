import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  RSVP: { all }
} = Ember;

/* global emit */
const ddoc = {
  views: {
    'by-id-with-feathers': {
      map(doc) {
        if(doc.type !== 'duck') {
          return;
        }
        emit(doc._id);
        let feathers = doc.feathers;
        if(!feathers) {
          return;
        }
        for(let i = 0; i < feathers.length; i++) {
          let id = feathers[i];
          emit(doc._id, { _id: id });
        }
      }
    }
  }
};

module('document-proxy-linked-remote', {
  async beforeEach() {
    this.owner = Ember.Object.create({ key: 'duck:yellow' });
    this.opts = {
      owner: [ 'key' ],
      document: [ 'type' ],
      matches(doc) {
        return doc.get('type') === 'duck';
      },
      query(owner) {
        // TODO: additional param for expectation after load otherwise throw `not_found`?
        // then that can be used in general for `first`
        let key = owner.get('key');
        return { ddoc: 'duck', view: 'by-id-with-feathers', limit: undefined, key };
      }
    };
    this.create = () => this.db._createInternalDocumentProxy(this.owner, this.opts).model(true);
    this.insert = async () => {
      await all([
        this.docs.save({
          _id: 'duck:yellow',
          type: 'duck',
          feathers: [ 'duck:yellow:feather:yellow', 'duck:yellow:feather:green' ]
        }),
        this.docs.save({
          _id: 'duck:yellow:feather:yellow',
          type: 'feather'
        }),
        this.docs.save({
          _id: 'duck:yellow:feather:green',
          type: 'feather'
        })
      ]);
    };
    await this.recreate();
    await all([
      this.docs.get('design').save('duck', ddoc),
      this.insert()
    ]);
  }
});

test('load', async function(assert) {
  let proxy = this.create();
  await proxy.load();
  let duck = this.db.existing('duck:yellow');
  assert.ok(duck);
  assert.ok(this.db.existing('duck:yellow:feather:yellow'));
  assert.ok(this.db.existing('duck:yellow:feather:green'));
  assert.ok(proxy.get('content') === duck);
});
