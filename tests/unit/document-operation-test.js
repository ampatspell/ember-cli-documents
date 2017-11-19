import { all } from 'rsvp';
import configurations from '../helpers/configurations';
import { test } from '../helpers/qunit';

configurations(module => {

  module('document-operation', {
    beforeEach() {
      return this.recreate();
    }
  });

  test('save, relaod, delete succeeds', async function(assert) {
    let doc = this.db.doc({ id: 'thing' });
    let promises = all([
      doc.save(),
      doc.save(),
      doc.reload(),
      doc.save(),
      doc.delete()
    ]);
    await promises;
    assert.ok(this.db._documents.deleted.thing);
  });

});
