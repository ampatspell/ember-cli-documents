import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('document-attachment-string');

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

test('attachment string content internal has data', function(assert) {
  let attachment = this.db.attachment({ data: 'foobar' });
  let internal = attachment.get('content')._internal;
  assert.equal(internal.value, 'foobar');
  assert.equal(internal.contentType, 'text/plain');
});

test('save', async function(assert) {
  await this.recreate();

  let doc = this.db.doc({ id: 'foo' });
  doc.get('attachments').set('message', { data: 'hey there' });

  await doc.save();

  let json = await this.docs.load('foo');

  assert.deepEqual_(json, {
    "_attachments": {
      "message": {
        "content_type": "text/plain",
        "digest": "ignored",
        "length": 9,
        "revpos": "ignored",
        "stub": true
      }
    },
    "_id": "foo",
    "_rev": "ignored"
  });
});

test('load', async function(assert) {
  await this.recreate();
  await this.docs.save({ _id: 'thing', _attachments: { message: { content_type: 'text/plain', data: 'hey there' } } });
  let doc = await this.db.find('thing');
  assert.ok(doc.get('attachments.message'));
  assert.deepEqual_(doc.get('attachments.message')._internal.content.props, {
    "content_type": "text/plain",
    "digest": "ignored",
    "length": 9,
    "revpos": "ignored",
    "stub": true
  });
});

test('document is reloaded after save and string content is replaced by stub', async function(assert) {
  await this.recreate();
  let doc = this.db.doc({ id: 'foo' });
  doc.get('attachments').set('message', { data: 'hey there' });

  let internal = doc.get('attachments.message')._internal;
  let content = internal.content;

  await doc.save();

  assert.equal(doc.get('attachments.message.type'), 'stub');
  assert.ok(internal === doc.get('attachments.message')._internal);
  assert.ok(content !== doc.get('attachments.message')._internal.content);
});
