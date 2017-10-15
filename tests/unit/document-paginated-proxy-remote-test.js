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

let _opts = {
  ddoc: 'main',
  view: 'all',
  limit: 3,
  start: null,
  end: {}
};

module('document-paginated-proxy-remote', {
  async beforeEach() {
    this.owner = Ember.Object.create({ type: 'duck' });
    this.opts = {
      query(owner, state) {
        let opts = _opts;

        let ddoc = opts.ddoc;
        let view = opts.view;
        let limit = opts.limit + 1;
        let skip;
        let startkey;
        let startkey_docid;
        let endkey = opts.end;

        if(state) {
          skip = 1;
          startkey_docid = state.id;
          startkey = state.value;
          skip = 1;
        } else {
          startkey = opts.start;
        }

        return {
          ddoc,
          view,
          skip,
          limit,
          startkey,
          startkey_docid,
          endkey
        };
      },
      loaded(array) {
        let opts = _opts;

        let { length, lastObject } = array.getProperties('length', 'lastObject');

        let isMore = false;
        let state = null;

        if(lastObject) {
          let id = lastObject.get('id');
          state = {
            id: id,
            value: id
          };
          isMore = length > opts.limit;
        }

        return {
          isMore,
          state
        };
      },
      matches(doc) {
        return doc.get('type') === 'duck';
      },
    };
    this.create = () => this.db._createInternalPaginatedProxy(this.owner, this.opts).model(true);
    this.insert = (count=10) => {
      let promises = [];
      for(let i = 0; i < count; i++) {
        promises.push(this.docs.save({ _id: `duck:${i}`, type: 'duck' }));
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

test.todo('content includes only state-matched docs', async function(assert) {
  await this.insert();
  let proxy = this.create();

  assert.equal(proxy.get('length'), 0);

  await proxy.load();

  assert.equal(proxy.get('length'), 3);
});

test.todo('content includes only state-matched docs with all loaded previously', async function(assert) {
  await this.insert();
  await this.db.find({ ddoc: 'main', view: 'all' });
  let proxy = this.create();

  assert.equal(proxy.get('length'), 0);

  await proxy.load();

  assert.equal(proxy.get('length'), 3);
});
