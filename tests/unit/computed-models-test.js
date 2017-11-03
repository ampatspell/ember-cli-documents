import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import models from 'documents/properties/models';
import { Model, Models } from 'documents';

const {
  A
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
        prop: models({
          dependencies: [ 'docs' ],
          type: opts.type || 'ducks',
          create(owner) {
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
