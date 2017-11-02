import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import model from 'documents/properties/model';
import { Model } from 'documents';

const Duck = Model.extend({
});

const docModel = opts => model({
  dependencies: [ opts.doc ],
  type: opts.type,
  create(owner) {
    let doc = owner.get(opts.doc);
    if(!doc) {
      return;
    }
    return { doc };
  }
});

module('computed-model', {
  beforeEach() {
    this.register('model:duck', Duck);
    this.create = (opts={}) => {
      let Subject = Ember.Object.extend({
        doc: opts.doc,
        prop: docModel({ doc: 'doc', type: 'duck' })
      });
      return Subject.create({ store: this.store, database: this.db });
    };
  }
});

test('it exists', async function(assert) {
  let subject = this.create();
  assert.ok(subject);
});

test('model is created', async function(assert) {
  let subject = this.create();
  let model = subject.get('prop');
  assert.ok(Duck.detectInstance(model));
});

test('model has passed properties', async function(assert) {
  let doc = {};
  let subject = this.create({ doc });
  let model = subject.get('prop');
  assert.equal(model.get('doc'), doc);
  assert.equal(model.get('store'), this.store);
  assert.equal(model.get('database'), this.db);
});
