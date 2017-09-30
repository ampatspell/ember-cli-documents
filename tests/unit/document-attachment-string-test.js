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

test('attachment string content internal has values', function(assert) {
  let attachment = this.db.attachment({ data: 'foobar' });
  let internal = attachment.get('content')._internal;
  assert.equal(internal.value, 'foobar');
  assert.equal(internal.contentType, 'text/plain');
});
