import EmberObject from '@ember/object';
import { assign } from '@ember/polyfills';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { Models, Model, models } from 'documents';

const Foos = Models.extend();
const Foo = Model.extend();

module('computed-models-asserts', {
  beforeEach() {
    this.register('model:foos', Foos);
    this.register('model:foo', Foo);
    this.defaults = {
      store: 'store',
      database: 'db',
      owner: [ 'array' ],
      create(owner) {
        let source = owner.get('array');
        return {
          source,
          type: 'foos',    // required
          props: { owner } // optional, if provided, must be object
        };
      },
      model: {
        observe: [],
        create(doc, models) {
          return {
            type: 'foo',             // required
            props: { doc, models }   // optional
          };
        }
      }
    };
    this.create = opts => {
      let Subject = EmberObject.extend({
        array: [ 'a' ],
        prop: models(assign({}, this.defaults, opts))
      });
      return Subject.create({ store: this.store, database: this.db });
    };
  }
});

test('create with defaults succeeds', function(assert) {
  let subject = this.create();
  let prop = subject.get('prop');
  assert.ok(prop);
  assert.ok(Foos.detectInstance(prop));
  assert.ok(prop.get('owner') === subject);
  assert.equal(prop.get('length'), 1);
  assert.ok(Foo.detectInstance(prop.get('lastObject')));
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
  assert.ok(subject.get('prop.database') === undefined);
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
  assert.ok(subject.get('prop.database') === undefined);
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
  let subject = this.create({ create: () => ({ type: 'foos', props: 1 })  });
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
  let subject = this.create({ create: () => ({ type: 'foos', source: [] })  });
  assert.ok(subject.get('prop'));
});

test('if create returns null, models is not created', function(assert) {
  let subject = this.create({ create: () => null });
  assert.ok(!subject.get('prop'));
});

test('if create returns type null, models is not created', function(assert) {
  let subject = this.create({ create: () => ({ type: null, source: [] }) });
  assert.ok(!subject.get('prop'));
});

test('model type is required', function(assert) {
  let subject = this.create({ create: () => ({ type: undefined, source: [] }) });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model name must be string"
    });
  }
});

test('model must be object', function(assert) {
  let subject = this.create({ model: 1 });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model must be object"
    });
  }
});

test('model.observe must be array', function(assert) {
  let subject = this.create({ model: assign(this.defaults.model, { observe: null }) });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model.observe must be array"
    });
  }
});

test('model.create must be function', function(assert) {
  let subject = this.create({ model: assign(this.defaults.model, { create: 1 }) });
  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model.create must be string or function"
    });
  }
});

test('model.create may be string', function(assert) {
  let subject = this.create({ model: assign(this.defaults.model, { create: 'foo' }) });
  let prop = subject.get('prop');
  assert.ok(Foo.detectInstance(prop.get('lastObject')));
});

test('model.create props must be object', function(assert) {
  let subject = this.create({
    model: assign(this.defaults.model, {
      create() {
        return {
          type: 'foo',
          props: 1
        }
      }
    })
  });

  try {
    subject.get('prop');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "props in model.create function result must be object"
    });
  }
});

test('model.create may return undefined', function(assert) {
  let subject = this.create({ model: assign(this.defaults.model, { create: () => undefined }) });
  let prop = subject.get('prop');
  assert.ok(!prop.get('lastObject'));
});
