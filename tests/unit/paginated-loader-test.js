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

let _opts = {
  ddoc: 'main',
  view: 'all',
  limit: 3,
  start: null,
  end: {}
};

module('paginated-loader', {
  async beforeEach() {
    this.owner = Ember.Object.create({ id: null });
    this.opts = {
      owner: [ 'id' ],
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
      didLoad(array) {
        let opts = _opts;

        let length = array.get('length');
        let last = array.get('lastObject');

        let isMore = false;
        let state = null;

        if(last) {
          let id = last.getId();
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

test('load first page', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  this.opts.autoload = false;
  let loader = this.loader();

  assert.deepEqual(loader.get('state'), {
    "error": null,
    "isError": false,
    "isLoaded": false,
    "isLoading": false,
    "isMore": false
  });

  let promise = loader.load();

  assert.deepEqual(loader.get('state'), {
    "error": null,
    "isError": false,
    "isLoaded": false,
    "isLoading": true,
    "isMore": false
  });

  await promise;

  assert.deepEqual(loader.get('state'), {
    "error": null,
    "isError": false,
    "isLoaded": true,
    "isLoading": false,
    "isMore": true
  });

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  run(() => loader.destroy());
});

test('load all pages', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  this.opts.autoload = false;
  let loader = this.loader();

  await loader.loadMore();
  await loader.loadMore();
  await loader.loadMore();
  await loader.loadMore(); // extra

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4",
    "GET _design/main/_view/all?startkey=\"duck:3\"&endkey={}&include_docs=true&startkey_docid=duck:3&limit=4&skip=1",
    "GET _design/main/_view/all?startkey=\"duck:7\"&endkey={}&include_docs=true&startkey_docid=duck:7&limit=4&skip=1"
  ]);

  run(() => loader.destroy());
});

test('reload', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  this.opts.autoload = false;
  let loader = this.loader();

  await loader.reload();

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  run(() => loader.destroy());
});

test('reload with few loaded pages', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  this.opts.autoload = false;
  let loader = this.loader();

  await loader.loadMore();
  await loader.loadMore();

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4",
    "GET _design/main/_view/all?startkey=\"duck:3\"&endkey={}&include_docs=true&startkey_docid=duck:3&limit=4&skip=1"
  ]);

  tap.clear();

  await loader.reload();

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  tap.clear();

  await loader.load();

  assert.deepEqual(tap.urls, []);

  run(() => loader.destroy());
});

test('parallel load and loadMore', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  this.opts.autoload = false;
  let loader = this.loader();

  loader.load();
  loader.loadMore();

  await loader._internal.settle();

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  run(() => loader.destroy());
});

test('parallel loadMore and reload', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  this.opts.autoload = false;
  let loader = this.loader();

  await loader.load();

  assert.deepEqual(loader.get('state'), {
    "error": null,
    "isError": false,
    "isLoaded": true,
    "isLoading": false,
    "isMore": true
  });

  loader.loadMore();

  assert.deepEqual(loader.get('state'), {
    "error": null,
    "isError": false,
    "isLoaded": true,
    "isLoading": true,
    "isMore": true
  });

  loader.reload();

  assert.deepEqual(loader.get('state'), {
    "error": null,
    "isError": false,
    "isLoaded": false,
    "isLoading": true,
    "isMore": false
  });

  await loader._internal.settle();

  assert.deepEqual(loader.get('state'), {
    "error": null,
    "isError": false,
    "isLoaded": true,
    "isLoading": false,
    "isMore": true
  });

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4",
    "GET _design/main/_view/all?startkey=\"duck:3\"&endkey={}&include_docs=true&startkey_docid=duck:3&limit=4&skip=1",
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  run(() => loader.destroy());
});

test('autoload for state query', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  let loader = this.loader();

  assert.equal(loader._internal.state.isLoading, false);
  assert.equal(loader.get('isLoading'), true);
  assert.equal(loader._internal.operations.length, 1);

  await loader._internal.settle();

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  run(() => loader.destroy());
});

test('autoload on owner property change', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  let loader = this.loader();

  this.owner.set('id', 'one');
  this.owner.set('id', 'two');

  await loader._internal.settle();

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4",
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  run(() => loader.destroy());
});

test('autoload resets load state', async function(assert) {
  await this.recreate();
  await all([ this.insert(), this.design() ]);
  let tap = this.tap();
  let loader = this.loader();

  await loader.load();
  await loader.loadMore();

  this.owner.set('id', 'one');
  this.owner.set('id', 'two');

  await loader._internal.settle();

  assert.deepEqual(tap.urls, [
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4",
    "GET _design/main/_view/all?startkey=\"duck:3\"&endkey={}&include_docs=true&startkey_docid=duck:3&limit=4&skip=1",
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4",
    "GET _design/main/_view/all?endkey={}&include_docs=true&limit=4"
  ]);

  run(() => loader.destroy());
});
