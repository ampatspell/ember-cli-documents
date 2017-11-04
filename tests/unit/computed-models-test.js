import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import models from 'documents/properties/models';
import { Model, Models } from 'documents';

const {
  A,
  get
} = Ember;

const Ducks = Models.extend({
});

const Duck = Model.extend({
});

module('computed-models', {
  beforeEach() {
    this.register('model:ducks', Ducks);
    this.register('model:duck', Duck);
    this.create = (opts={}) => {
      let Subject = Ember.Object.extend({
        docs: opts.docs,
        message: 'hey there',
        prop: models({
          owner: [ 'docs' ],
          type: () => opts.hasOwnProperty('type') ? opts.type : 'ducks',
          source(owner) {
            return owner.get('docs');
          },
          create(owner) {
            let message = owner.get('message');
            return {  message };
          }
        })
      });
      return Subject.create({ store: this.store, database: this.db });
    };
  }
});

test('it exists', async function(assert) {
  let subject = this.create({ docs: [] });
  assert.ok(subject);
  assert.ok(subject.get('prop'));
});

test('requires model type to be models', function(assert) {
  let subject = this.create({ docs: [], type: 'duck' });
  try {
    subject.get('prop');
    assert.ok(false, 'should throw');
  } catch(err) {
    assert.deepEqual(err.toJSON(), {
      "error": "assertion",
      "reason": "model for name 'duck' must extend Models"
    });
  }
});

test('by default models are base class', function(assert) {
  let subject = this.create({ docs: [], type: undefined });
  let prop = subject.get('prop');
  assert.ok(Models.detectInstance(prop));
  assert.ok((prop+'').includes('@documents:models::'));
  assert.equal(get(prop.constructor, 'modelName'), undefined);
});

test('by models are not created if type is null', function(assert) {
  let subject = this.create({ docs: [], type: null });
  let prop = subject.get('prop');
  assert.ok(!prop);
});

test('it is possible to provide custom class', async function(assert) {
  let subject = this.create({ docs: [] });
  let prop = subject.get('prop');
  assert.ok(Models.detectInstance(prop));
  assert.equal(get(prop.constructor, 'modelName'), 'ducks');
});

test('it has additional props from create', function(assert) {
  let docs = [];
  let subject = this.create({ docs });
  let prop = subject.get('prop');
  assert.equal(prop.get('message'), 'hey there');
});

test('it has internal _array', function(assert) {
  let docs = [];
  let subject = this.create({ docs });
  let prop = subject.get('prop');
  assert.ok(prop._internal._array === docs);
});

test.todo('it has content', function(assert) {
  let docs = A();
  let one = {};

  let subject = this.create({ docs });
  let prop = subject.get('prop');

  assert.equal(prop.get('content.length'), 0);

  docs.pushObject(one);
  assert.equal(prop.get('content.length'), 1);
});
