import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import createExtendable from 'documents/properties/-create-extendable';

let extendable = createExtendable({
  arrays: [ 'owner', 'document' ],
  functions: [ 'query', 'matches', 'loaded' ]
});

const {
  merge
} = Ember;

module('property-extendable', {
  beforeEach() {
    this.build = () => {
      return extendable(opts => opts);
    }
  }
});

test('sanity', function(assert) {
  assert.expect(3);

  let subject = this.build();

  let result = subject.extend(opts => {
    assert.deepEqual(opts, {
      "document": [],
      "owner": [],
      "three": true,
      "two": true
    });
    return { one: true };
  }).extend(opts => {
    assert.deepEqual(opts, {
      "document": [],
      "owner": [],
      "three": true
    });
    return { two: true };
  })({ three: true });

  assert.deepEqual(result, {
    "document": [],
    "owner": [],
    "one": true,
    "three": true,
    "two": true
  });
});

test('extend overrides unknown property', function(assert) {
  assert.expect(3);

  let subject = this.build();

  let result = subject.extend(opts => {
    assert.deepEqual(opts, {
      "document": [],
      "owner": [],
      "id": "two"
    }, '1');
    return { id: 'one' };
  }).extend(opts => {
    assert.deepEqual(opts, {
      "document": [],
      "owner": [],
      "id": "three"
    }, '2');
    return { id: 'two' };
  })({ id: 'three' });

  assert.deepEqual(result, {
    "document": [],
    "owner": [],
    "id": "one"
  }, '3');
});

test('extend splits', function(assert) {
  let subject = this.build();
  let base = subject.extend(() => ({ owner: [ 'base' ], base: 'base' }));
  let one = base.extend(() => ({ owner: [ 'one' ], id: 'one' })).extend(() => ({ owner: [ 'one-one' ], name: 'one' }))({ use: 'one' });
  let two = base.extend(() => ({ owner: [ 'two' ], id: 'two' })).extend(() => ({ owner: [ 'two-two' ], name: 'two' }))({ use: 'two' });

  assert.deepEqual(one, {
    "document": [],
    "owner": [
      "base",
      "one",
      "one-one"
    ],
    "base": "base",
    "id": "one",
    "name": "one",
    "use": "one"
  });

  assert.deepEqual(two, {
    "document": [],
    "owner": [
      "base",
      "two",
      "two-two"
    ],
    "base": "base",
    "id": "two",
    "name": "two",
    "use": "two"
  });

  assert.deepEqual(base({ use: 'base' }), {
    "document": [],
    "owner": [
      "base"
    ],
    "base": "base",
    "use": "base"
  });
});

test('extend has default owner and appends it', function(assert) {
  assert.expect(4);

  let subject = this.build()
    .extend(opts => {
      assert.deepEqual(opts, {
        "document": [],
        "owner": [
          "owner_two",
          "owner_three"
        ]
      });
      return { owner: [ 'owner_one' ] };
    })
    .extend(opts => {
      assert.deepEqual(opts, {
        "document": [],
        "owner": [
          "owner_three"
        ]
      });
      return { owner: [ 'owner_two' ] };
    });

  let result = subject(opts => {
    assert.deepEqual(opts, {
      "document": [],
      "owner": []
    });
    return { owner: [ 'owner_three' ] }
  });

  assert.deepEqual(result, {
    "document": [],
    "owner": [
      "owner_one",
      "owner_two",
      "owner_three"
    ]
  });
});

test('extend appends owner and document', function(assert) {
  let subject = this.build()
    .extend(opts => {
      assert.deepEqual(opts, {
        "document": [
          "document_two",
          "document_three"
        ],
        "owner": [
          "owner_two",
          "owner_three"
        ]
      });
      return { owner: [ 'owner_one' ], document: [ 'document_one' ] };
    })
    .extend(opts => {
      assert.deepEqual(opts, {
        "document": [
          "document_three"
        ],
        "owner": [
          "owner_three"
        ]
      });
      return { owner: [ 'owner_two' ], document: [ 'document_two' ] };
    });

  let result = subject(({ owner: [ 'owner_three' ], document: [ 'document_three' ] }))

  assert.deepEqual(result, {
    "document": [
      "document_one",
      "document_two",
      "document_three"
    ],
    "owner": [
      "owner_one",
      "owner_two",
      "owner_three"
    ]
  });
});

test('query fn without _super', function(assert) {
  assert.expect(2);
  let result = {};
  let subject = this.build().extend(() => ({
    query() {
      assert.ok(!this._super);
      return result;
    }
  }))({});
  assert.ok(subject.query() === result);
});

test('extend query', function(assert) {
  assert.expect(4);
  let one = {};
  let two = {};
  let subject = this.build().extend(() => ({
    id: 'one',
    query() {
      assert.ok(!this._super);
      return one;
    }
  })).extend(() => ({
    id: 'two',
    query() {
      assert.ok(this._super);
      assert.ok(this._super() === one);
      return two;
    }
  }))({});
  assert.ok(subject.query() === two);
});

test('extend query with undefined in between', function(assert) {
  assert.expect(4);
  let one = {};
  let two = {};
  let subject = this.build()
    .extend(() => ({
      id: 'one',
      query() {
        assert.ok(!this._super);
        return one;
      }
    }))
    .extend(() => ({}))
    .extend(() => ({
      id: 'two',
      query() {
        assert.ok(this._super);
        assert.ok(this._super() === one);
        return two;
      }
    }))({});
  assert.ok(subject.query() === two);
});

test('extend query', function(assert) {
  let subject = this.build().extend(() => ({
    query() {
      assert.ok(!this._super);
      return { one: true };
    }
  })).extend(() => ({
    query() {
      return merge(this._super(), { two: true });
    }
  }))({});
  assert.deepEqual(subject.query(), {
    one: true,
    two: true
  });
});

test('extend matches', function(assert) {
  let subject = this.build().extend(() => ({
    matches() {
      assert.ok(!this._super);
      return { one: true };
    }
  })).extend(() => ({
    matches() {
      return merge(this._super(), { two: true });
    }
  }))({});
  assert.deepEqual(subject.matches(), {
    one: true,
    two: true
  });
});

test('extend loaded', function(assert) {
  let subject = this.build().extend(() => ({
    loaded() {
      assert.ok(!this._super);
      return { one: true };
    }
  })).extend(() => ({
    loaded() {
      return merge(this._super(), { two: true });
    }
  }))({});
  assert.deepEqual(subject.loaded(), {
    one: true,
    two: true
  });
});

test('extend order and parent opts for actual usecase', function(assert) {
  let prop = this.build().extend(opts => {
    opts = merge({ id: 'id' }, opts);
    let { id } = opts;
    return {
      owner: [ opts.id ],
      document: [ 'id' ],
      query() {
        assert.equal(id, 'docId');
        return { id };
      }
    };
  }).extend(opts => {
    opts = merge({ database: 'database' }, opts);
    let { database } = opts;
    return {
      database
    };
  });

  let result = prop({ database: 'db', id: 'docId' });

  assert.deepEqual(result, {
    database: 'db',
    id: 'docId',
    document: [ 'id' ],
    owner: [ 'docId' ],
    query: result.query
  });

  assert.deepEqual(result.query(), { id: 'docId' });
});
