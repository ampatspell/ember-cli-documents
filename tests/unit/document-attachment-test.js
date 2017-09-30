import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-attachment');

test('create detached attachment', function(assert) {
  let attachment = this.db.attachment({ data: 'hello' });
  assert.ok(attachment);
});

test('attachment has internal', function(assert) {
  let attachment = this.db.attachment({ data: 'hey' });
  assert.ok(attachment._internal);
});

test('attachment requires supported content', function(assert) {
  try {
    this.db.attachment({ });
  } catch(e) {
    assert.deepEqual(e.toJSON(), {
      "error": "invalid_attachment",
      "reason": "unsupported attachment object.data 'undefined'. data may be String, File or Blob"
    });
  }
});
