import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  RSVP: { all }
} = Ember;

const ddoc = {
  views: {
    'by-type': {
      map(doc) {
        /* global emit */
        emit(doc.type);
      }
    }
  }
};

module('document-paginated-proxy-remote', {
  async beforeEach() {
    this.owner = Ember.Object.create({ type: 'duck' });
    this.opts = {
      owner: [ 'type' ],
      document: [ 'type' ],
      matches(doc, owner) {
        return doc.get('type') === owner.get('type');
      },
      query(owner) {
        let type = owner.get('type');
        return { ddoc: 'main', view: 'by-type', key: type };
      }
    };
    this.create = () => this.db._createInternalPaginatedProxy(this.owner, this.opts).model(true);
    await this.recreate();
    await this.docs.get('design').save('main', ddoc);
  }
});

test('exists', function(assert) {
  let proxy = this.create();
  assert.ok(proxy);
  assert.ok(proxy._internal);
});
