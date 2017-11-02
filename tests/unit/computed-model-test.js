import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import model from 'documents/properties/model';
import { Model } from 'documents';
import { prop } from 'documents/properties';

const Duck = Model.extend({

});

module('computed-model', {
  beforeEach() {
    this.register('model:duck', Duck);
    this.create = (opts={}) => {
      let Subject = Ember.Object.extend({
        doc: opts.doc,
        prop: model('doc', {
          type: 'duck',
          create() {
            let doc = this.get('doc');
            if(!doc) {
              return;
            }
            return { doc };
          }
        })
      });
      return Subject.create({ store: this.store });
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

test.todo('model has passed properties', async function(assert) {
  let doc = {};
  let subject = this.create({ doc });
  let model = subject.get('prop');
  assert.equal(model.get('doc'), doc);
});
