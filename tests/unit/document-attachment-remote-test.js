import configurations from '../helpers/configurations';
import { test } from '../helpers/qunit';

configurations(module => {

  module('document-attachment-remote', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('attachment is remote', async function(assert) {
    let att = this.db.attachment({ data: 'hey' });
    let doc = this.db.doc({ attachments: { thing: att } });

    await doc.save();

    assert.equal(att.get('location'), 'remote');
    assert.equal(att.get('isLocal'), false);
    assert.equal(att.get('isRemote'), true);
  });

});
