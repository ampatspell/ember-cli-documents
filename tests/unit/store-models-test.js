import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import Model from 'documents/document/model';
import Models from 'documents/document/models';

const {
  A,
  get,
  run
} = Ember;

const Duck = Model.extend();
const GreenDuck = Duck.extend();
const YellowDuck = Duck.extend();

const Ducks = Models.extend();

module('store-models', {
  beforeEach() {
    this.register('model:ducks', Ducks);
    this.register('model:duck/green', GreenDuck);
    this.register('model:duck/yellow', YellowDuck);
    this.ducks = A();
    this.create = () => this.store.models('ducks', this.ducks, {
      message: 'hello',
      document: [ 'type' ],
      type(doc) {
        let type = get(doc, 'type');
        if(!type) {
          return;
        }
        return `duck/${type}`;
      },
      create(doc) {
        return { doc };
      }
    });
  }
});

test('create models with source', function(assert) {
  let models = this.create();

  assert.equal(models.get('length'), 0);
  assert.equal(models.get('message'), 'hello');
  assert.equal(models.get('type'), undefined);
  assert.equal(models.get('create'), undefined);
  assert.equal(models.get('document'), undefined);
});

test('added docs are wrapped in models', function(assert) {
  let ducks = this.ducks;
  let models = this.create();

  assert.equal(models.get('length'), 0);

  ducks.pushObject({ id: 'one', type: 'green' });
  assert.equal(models.get('length'), 1);
  assert.ok(GreenDuck.detectInstance(models.objectAt(0)));
  assert.equal(models.objectAt(0).get('doc'), ducks.objectAt(0));

  ducks.pushObject({ id: 'two', type: 'yellow' });
  assert.equal(models.get('length'), 2);
  assert.ok(YellowDuck.detectInstance(models.objectAt(1)));
  assert.equal(models.objectAt(1).get('doc'), ducks.objectAt(1));
});

test('remove doc removes model', function(assert) {
  let ducks = this.ducks;
  let models = this.create();

  let doc = { id: 'one', type: 'green' };

  ducks.pushObject(doc);

  let model = models.objectAt(0);
  assert.ok(model);

  run(() => ducks.removeObject(doc));

  assert.equal(models.get('length'), 0);
  assert.ok(model.isDestroying);
});

test('model is recreated on doc.type change', function(assert) {
  let ducks = this.ducks;
  let models = this.create();

  let doc = Ember.Object.create({ id: 'one', type: 'green' });

  ducks.pushObject(doc);

  let green = models.objectAt(0);
  assert.ok(green);
  assert.ok(GreenDuck.detectInstance(green));

  run(() => doc.set('type', 'yellow'));

  let yellow = models.objectAt(0);
  assert.ok(yellow);
  assert.ok(YellowDuck.detectInstance(yellow));

  assert.ok(green !== yellow);

  assert.ok(green.isDestroying);
});

