import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import Model from 'documents/document/model';
import Models from 'documents/document/models';

const {
  A,
  get
} = Ember;

const Duck = Model.extend();
const GreenDuck = Duck.extend();
const YellowDuck = Duck.extend();

const Ducks = Models.extend();

module('store-models');

test('create models with source', function(assert) {
  this.register('model:ducks', Ducks);
  this.register('model:duck/green', GreenDuck);
  this.register('model:duck/yellow', YellowDuck);
  let ducks = A();
  let models = this.store.models('ducks', ducks, {
    message: 'hello',
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
  assert.equal(models.get('length'), 0);
  assert.equal(models.get('message'), 'hello');
  assert.equal(models.get('type'), undefined);
  assert.equal(models.get('create'), undefined);

  ducks.pushObject({ id: 'one', type: 'green' });
  assert.equal(models.get('length'), 1);
  assert.ok(GreenDuck.detectInstance(models.objectAt(0)));
  assert.equal(models.objectAt(0).get('doc'), ducks.objectAt(0));

  ducks.pushObject({ id: 'two', type: 'yellow' });
  assert.equal(models.get('length'), 2);
  assert.ok(YellowDuck.detectInstance(models.objectAt(1)));
  assert.equal(models.objectAt(1).get('doc'), ducks.objectAt(1));
});
