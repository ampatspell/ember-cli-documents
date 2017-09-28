/* global emit */
import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  RSVP: { all }
} = Ember;

const main = {
  views: {
    'by-type': {
      map(doc) {
        emit(doc.type);
      }
    }
  }
};

module('database-internal-find-view', {
  beforeEach() {
    return this.recreate().then(() => this.db.get('documents.design').save('main', main));
  }
});

test('find view returns empty array', async function(assert) {
  let { type, result } = await this.db._internalDocumentFind({ ddoc: 'main', view: 'by-type' });
  assert.equal(type, 'array');
  assert.equal(result.length, 0);
});

test('find view returns documents', async function(assert) {
  await all([
    this.docs.save({ _id: 'one', type: 'foo' }),
    this.docs.save({ _id: 'two', type: 'bar' }),
    this.docs.save({ _id: 'three', type: 'foo' })
  ]);

  let { type, result } = await this.db._internalDocumentFind({ ddoc: 'main', view: 'by-type', key: 'foo' });
  assert.equal(type, 'array');
  assert.equal(result.length, 2);
  assert.deepEqual(result.map(internal => internal.getId()), [ 'one', 'three' ]);
});
