import EmberObject from '@ember/object';
import { assign } from '@ember/polyfills';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { Models, Model } from 'documents';

const Ponyhof = Models.extend();
const Duck = Model.extend();

module('internal-models', {
  beforeEach() {
    this.register('model:ponyhof', Ponyhof);
    this.register('model:duck', Duck);
    this.source = [
      EmberObject.create({ id: 'yellow' }),
      EmberObject.create({ id: 'green' })
    ];
    this.defaults = {
      database: this.db,
      type: 'ponyhof',
      source: this.source,
      props:  { ok: true },
      model: {
        observe: [ 'id' ],
        create(doc, models) {
          return {
            type: 'duck',
            props: { doc }
          }
        }
      },
      _parent: null
    };
    this.create = opts => this.store._createInternalModels(assign({}, this.defaults, opts));
  }
});

test('create succeeds', function(assert) {
  let internal = this.create();
  assert.ok(internal);

  let model = internal.model(true);
  assert.ok(Ponyhof.detectInstance(model));
  assert.equal(model.get('ok'), true);
  assert.equal(model.get('store'), this.store);
  assert.equal(model.get('database'), this.db);

  assert.equal(model.get('length'), 2);

  let yellow = model.objectAt(0);
  assert.ok(Duck.detectInstance(yellow));
  assert.equal(yellow.get('doc'), this.source.objectAt(0));
});

test('create with parent', function(assert) {
  let _parent = {};
  let internal = this.create({ _parent });
  assert.ok(internal.parent === _parent);
});

test('models has ref', function(assert) {
  let internal = this.create();
  assert.ok(internal.values[0]._ref === this.source[0]);
});
