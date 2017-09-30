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
  let attachment = this.db.attachment();
  assert.ok(attachment);
});

test('attachment has internal', function(assert) {
  let attachment = this.db.attachment();
  assert.ok(attachment._internal);
});

test('attachment has string content', function(assert) {
  let attachment = this.db.attachment();
  let content = attachment.get('content');
  assert.ok(content);
  assert.equal(content.get('type'), 'placeholder');
});

test('attachment has string content internal', function(assert) {
  let attachment = this.db.attachment();
  let content = attachment.get('content');
  let internal = content._internal;
  assert.equal(internal.type, 'placeholder');
});
