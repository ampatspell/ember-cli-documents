import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run,
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
    this.insert = (count=10) => {
      let promises = [];
      for(let i = 0; i < count; i++) {
        promises.push(this.docs.save({ _id: `duck:${i}` }));
      }
      return all(promises);
    }
    this.loader = () => this.db._createInternalPaginatedLoader(this.owner, this.opts).model(true);
    this.settle = loader => loader._internal.settle();
    this.design = () => this.docs.get('design').save('main', ddoc);
  }
});

test('it exists', function(assert) {
  this.opts.autoload = false;

  let loader = this.loader();
  assert.ok(loader);

  run(() => loader.destroy());
});

test('pagination logic', async function(assert) {
  await this.recreate();
  await all([ this.design(), this.insert() ]);

  let opts = {
    start: null,
    end: {},
    limit: 3
  };

  let state = null;

  let load = async (expectedIds, expectedState) => {
    let startkey;
    let startkey_docid;
    let skip;

    if(state) {
      startkey_docid = state.startkey_docid;
      startkey = state.value;
      skip = 1;
    } else {
      startkey = opts.start;
    }

    let limit = opts.limit + 1;
    let endkey = opts.end;

    let json = await this.docs.view('main', 'all', { skip, limit, endkey, startkey_docid, startkey, include_docs: true });
    let docs = json.rows.map(row => row.doc);

    if(docs.length > 0) {
      let last = docs[docs.length - 1];
      state = {
        startkey_docid: last._id,
        value: last._id,
        isMoreAvailable: docs.length > opts.limit
      };
    } else {
      state = {
        isMoreAvailable: false
      };
    }

    assert.deepEqual(docs.map(doc => doc._id), expectedIds);
    assert.deepEqual(state, expectedState);
  };

  let tap = this.tap();

  await load([
    "duck:0",
    "duck:1",
    "duck:2",
    "duck:3"
  ], {
    "isMoreAvailable": true,
    "startkey_docid": "duck:3",
    "value": "duck:3"
  });

  await load([
    "duck:4",
    "duck:5",
    "duck:6",
    "duck:7"
  ], {
    "isMoreAvailable": true,
    "startkey_docid": "duck:7",
    "value": "duck:7"
  });

  await load([
    "duck:8",
    "duck:9"
  ], {
    "isMoreAvailable": false,
    "startkey_docid": "duck:9",
    "value": "duck:9"
  });

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4",
    "GET _design/main/_view/all?startkey=\"duck:3\"&endkey={}&include_docs=true&startkey_docid=duck:3&limit=4&skip=1",
    "GET _design/main/_view/all?startkey=\"duck:7\"&endkey={}&include_docs=true&startkey_docid=duck:7&limit=4&skip=1"
  ]);

});

// test('load first page', async function(assert) {
//   await this.recreate();
//   await this.insert();
//   await this.design();

//   this.opts.autoload = false;

//   let loader = this.loader();

//   await loader.load();

//   run(() => loader.destroy());
// });
