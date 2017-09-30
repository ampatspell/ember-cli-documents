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

test('detached attachment can be attached', function(assert) {
  let doc = this.db.doc();
  let msg = this.db.attachment({ data: 'hey there' });
  doc.get('attachments').set('message', msg);
  assert.ok(doc.get('attachments.message') === msg);
  assert.ok(msg._internal.parent === doc.get('attachments')._internal);
});

test('attachment can be created from object', function(assert) {
  let doc = this.db.doc();
  doc.get('attachments').set('message', { data: 'hey there' });
  assert.equal(doc.get('attachments.message')._internal.content.data, 'hey there');
});

test('add attachment marks document dirty', function(assert) {
  let doc = this.db.doc();
  let attachments = doc.get('attachments');
  assert.equal(doc.get('isDirty'), false);
  attachments.set('message', { data: 'hey there' });
  assert.equal(doc.get('isDirty'), true);
});
