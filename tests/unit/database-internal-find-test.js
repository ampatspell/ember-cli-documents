import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';

module('database-internal-find', {
  beforeEach() {
    return this.recreate();
  }
});

const err = {
  "error": "invalid_query",
  "reason": "opts must include { all: true }, { id }, { ids }, { ddoc, view } or { selector }"
};

test('invalid arg throws for find', async function(assert) {
  try {
    await this.db._internalDocumentFind({});
    assert.ok(false, 'should throw');
  } catch(e) {
    assert.deepEqual(e.toJSON(), err);
  }
});

test('invalid arg throws for first', async function(assert) {
  try {
    await this.db._internalDocumentFirst({});
    assert.ok(false, 'should throw');
  } catch(e) {
    assert.deepEqual(e.toJSON(), err);
  }
});
