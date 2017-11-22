import EmberObject from '@ember/object';
import { assign } from '@ember/polyfills';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { Model, model } from 'documents';

const Foo = Model.extend();

module('computed-model-asserts', {
  beforeEach() {
    this.register('model:foo', Foo);
    this.defaults = {
      store: 'store',
      database: 'db',
      owner: [],
      create(owner) {
        return {
          type: 'foo',     // required
          props: { owner } // optional, if provided, must be object
        };
      }
    };
    this.create = opts => {
      let Subject = EmberObject.extend({
        prop: model(assign({}, this.defaults, opts))
      });
      return Subject.create({ store: this.store, database: this.db });
    };
  }
});

test('create with defaults succeeds', function(assert) {
  let subject = this.create();
  let prop = subject.get('prop');
  assert.ok(prop);
  assert.ok(Foo.detectInstance(prop));
  assert.ok(prop.get('owner') === subject);
});

test('store must be string', function(assert) {
  let subject = this.create({ store: {} });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "store must be string"
    });
  }
});

test('database must be string', function(assert) {
  let subject = this.create({ database: {} });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "database must be string"
    });
  }
});

test('store and database is null', function(assert) {
  let subject = this.create({ store: null, database: null });
  assert.ok(!subject.get('prop'));
});

test('database is null', function(assert) {
  let subject = this.create({ database: null });
  assert.ok(subject.get('prop.database') === null);
  assert.ok(subject.get('prop.store') === this.store);
});

test('database default', function(assert) {
  delete this.defaults.store;
  delete this.defaults.database;
  let subject = this.create();
  assert.ok(subject.get('prop.database') === this.db);
  assert.ok(subject.get('prop.store') === this.store);
});

test('store default', function(assert) {
  delete this.defaults.store;
  delete this.defaults.database;
  let subject = this.create();
  subject.set('database', null);
  assert.ok(subject.get('prop.database') === null);
  assert.ok(subject.get('prop.store') === this.store);
});

test('owner must be array', function(assert) {
  try {
    this.create({ owner: null });
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "owner must be array"
    });
  }
});

test('create must be function', function(assert) {
  let subject = this.create({ create: {} });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "create must be function"
    });
  }
});

test('create must be function', function(assert) {
  let subject = this.create({ create: null });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "create must be function"
    });
  }
});

test('create result must be object', function(assert) {
  let subject = this.create({ create: () => 1  });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "create function result must be object"
    });
  }
});

test('create result type must be object', function(assert) {
  let subject = this.create({ create: () => ({ type: {} })  });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "type in create function result must be string"
    });
  }
});

test('create result props must be object', function(assert) {
  let subject = this.create({ create: () => ({ type: 'foo', props: 1 })  });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "props in create function result must be object"
    });
  }
});

test('props are optional', function(assert) {
  let subject = this.create({ create: () => ({ type: 'foo' })  });
  assert.ok(subject.get('prop'));
});

test('create may return string', function(assert) {
  let subject = this.create({ create: () => 'foo' });
  assert.ok(Foo.detectInstance(subject.get('prop')));
});

test('create may return null', function(assert) {
  let subject = this.create({ create: () => null });
  assert.ok(!subject.get('prop'));
});
