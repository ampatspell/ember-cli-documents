import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import models from 'documents/properties/models';
import { Model } from 'documents';

const {
  A
} = Ember;

const Ducks = Model.extend({
});

module('computed-models', {
  beforeEach() {
    this.register('model:ducks', Ducks);
    this.create = (opts={}) => {
      let Subject = Ember.Object.extend({
        docs: opts.docs,
        prop: models({
          dependencies: [ 'docs' ],
          type: 'ducks',
          create(owner) {
          }
        })
      });
      return Subject.create({ store: this.store, database: this.db });
    };
  }
});

test('it exists', async function(assert) {
  let subject = this.create({ docs: A([ { id: 'one' }, { id: 'two' }]) });
  assert.ok(subject);
  assert.ok(subject.get('prop'));
  console.log(subject.get('prop'));
});
