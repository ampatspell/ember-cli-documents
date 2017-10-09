import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('filter', {
  beforeEach() {
    this.owner = Ember.Object.create({ type: null });
    this.opts = {
      owner: { type: 'type' },
      document: { type: 'type' },
      matches(doc, props) {
        return doc.get('type') === props.type;
      }
    };
    this.filter = () => this.db._createInternalFilter(this.owner, this.opts).model(true);
  }
});

test('create filter', function(assert) {
  let filter = this.filter();
  assert.ok(filter);
  assert.equal(filter.get('values.length'), 0);
  assert.equal(filter.get('value'), undefined);
});

test('create filter with existing matched values', function(assert) {
  let duck = this.db.doc({ id: 'duck:yellow', type: 'duck' });
  this.db.doc({ id: 'house:big', type: 'house' });
  this.owner.set('type', 'duck');
  let filter = this.filter();
  assert.equal(filter.get('values.length'), 1);
  assert.equal(filter.get('value'), duck);
});

test('updated doc is removed from values', function(assert) {
  let duck = this.db.doc({ id: 'duck:yellow', type: 'duck' });
  this.owner.set('type', 'duck');
  let filter = this.filter();
  assert.equal(filter.get('values.length'), 1);
  assert.equal(filter.get('value'), duck);
  duck.set('type', 'ducky');
  assert.equal(filter.get('values.length'), 0);
  assert.equal(filter.get('value'), undefined);
});

test('added doc is added to values', function(assert) {
  this.owner.set('type', 'duck');
  let filter = this.filter();
  assert.equal(filter.get('value'), undefined);
  let duck = this.db.doc({ id: 'duck:yellow', type: 'duck' });
  assert.equal(filter.get('value'), duck);
});
