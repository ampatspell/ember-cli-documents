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

test('attachment is local', function(assert) {
  let att = this.db.attachment({ data: 'hey' });
  assert.equal(att.get('location'), 'local');
  assert.equal(att.get('isLocal'), true);
  assert.equal(att.get('isRemote'), false);
});

test('attachment is remove', async function(assert) {
  let att = this.db.attachment({ data: 'hey' });
  let doc = this.db.doc({ attachments: { thing: att } });

  await doc.save();

  assert.equal(att.get('location'), 'remote');
  assert.equal(att.get('isLocal'), false);
  assert.equal(att.get('isRemote'), true);
});
