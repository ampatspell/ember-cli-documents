import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import extendable from 'documents/properties/-extendable';

module('property-extendable', {
  beforeEach() {
    this.build = () => {
      return extendable(opts => opts);
    }
  }
});

test('sanity', function(assert) {
  let subject = this.build();
  let result = subject.extend(() => ({ one: true })).extend(() => ({ two: true }))({ three: true });
  assert.deepEqual(result, {
    "one": true,
    "three": true,
    "two": true
  });
});

test('extend overrides unknown property', function(assert) {
  let subject = this.build();
  let result = subject.extend(() => ({ id: 'one' })).extend(() => ({ id: 'two' }))({});
  assert.deepEqual(result, {
    id: 'two'
  });
});

test('extend splits', function(assert) {
  let subject = this.build();
  let base = subject.extend(() => ({ base: 'base' }));
  let one = base.extend(() => ({ id: 'one' })).extend(() => ({ name: 'one' }))({ use: 'one' });
  let two = base.extend(() => ({ id: 'two' })).extend(() => ({ name: 'two' }))({ use: 'two' });
  assert.deepEqual(one, {
    "base": "base",
    "id": "one",
    "name": "one",
    "use": "one"
  });
  assert.deepEqual(two, {
    "base": "base",
    "id": "two",
    "name": "two",
    "use": "two"
  });
  assert.deepEqual(base({ use: 'base' }), {
    "base": "base",
    "use": "base"
  });
});

test('extend appends owner and document', function(assert) {
  let subject = this.build()
    .extend(() => ({ owner: [ 'owner_one' ], document: [ 'document_one' ] }))
    .extend(() => ({ owner: [ 'owner_two' ], document: [ 'document_two' ] }))
  let result = subject(({ owner: [ 'owner_three' ], document: [ 'document_three' ] }))
  assert.deepEqual(result, {
    "document": [
      "document_three",
      "document_two",
      "document_one"
    ],
    "owner": [
      "owner_three",
      "owner_two",
      "owner_one"
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

test('extend with undefined in between', function(assert) {
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
