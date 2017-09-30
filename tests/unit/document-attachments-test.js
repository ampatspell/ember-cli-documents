import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-attachments');

test('doc has attachments', function(assert) {
  let doc = this.db.doc();
  assert.ok(doc.get('attachments'));
});

test('attachments has _internal', function(assert) {
  let doc = this.db.doc();
  assert.ok(doc.get('attachments')._internal);
});
