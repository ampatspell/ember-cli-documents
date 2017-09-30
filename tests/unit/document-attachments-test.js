import Ember from 'ember';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

const {
  run
} = Ember;

module('document-attachments');

test('doc has attachments', function(assert) {
  let doc = this.db.doc();
  assert.ok(doc.get('attachments'));
});

test('attachments has _internal', function(assert) {
  let doc = this.db.doc();
  assert.ok(doc.get('attachments')._internal);
});

test('_model is unset on attachments destroy', async function(assert) {
  let doc = this.db.doc();
  let attachments = doc.get('attachments');
  let internal = attachments._internal;
  assert.ok(internal._model);

  run(() => attachments.destroy());

  assert.ok(attachments.isDestroyed);
  assert.ok(!internal._model);
});

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

test('attachment has string content', function(assert) {
  let attachment = this.db.attachment({ type: 'text/plain', data: 'hey there' });
  let content = attachment.get('content');
  assert.ok(content);
  assert.equal(content.get('type'), 'string');
});

test('attachment has string content internal', function(assert) {
  let attachment = this.db.attachment({ data: 'foobar' });
  let content = attachment.get('content');
  let internal = content._internal;
  assert.equal(internal.type, 'string');
});

test('attachment string content internal has values', function(assert) {
  let attachment = this.db.attachment({ data: 'foobar' });
  let internal = attachment.get('content')._internal;
  assert.equal(internal.value, 'foobar');
  assert.equal(internal.contentType, 'text/plain');
});
