import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  RSVP: { all }
} = Ember;

const ddoc = {
  views: {
    'all': {
      map(doc) {
        /* global emit */
        emit(doc._id);
      }
    }
  }
};

module('document-paginated-proxy-remote', {
  async beforeEach() {
    this.owner = Ember.Object.create({ type: 'duck' });
    this.opts = {
      matches(/*doc, owner*/) {
        return true;
      },
      query(/*owner*/) {
        return { ddoc: 'main', view: 'all', limit: 3 };
      },
      didLoad() {
        return {
          isMore: false,
          state: {}
        };
      }
    };
    this.create = () => this.db._createInternalPaginatedProxy(this.owner, this.opts).model(true);
    this.insert = (count=10) => {
      let promises = [];
      for(let i = 0; i < count; i++) {
        promises.push(this.docs.save({ _id: `duck:${i}` }));
      }
      return all(promises);
    }
    await this.recreate();
    await this.docs.get('design').save('main', ddoc);
  }
});

test('exists', function(assert) {
  let proxy = this.create();
  assert.ok(proxy);
  assert.ok(proxy._internal);
});

test('load', async function(assert) {
  await this.insert();
  let proxy = this.create();
  await proxy.load();
  assert.equal(proxy.get('length'), 3);
});
