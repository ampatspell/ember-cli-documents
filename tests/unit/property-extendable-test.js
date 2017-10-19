import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import extendable from 'documents/properties/-extendable';

module('property-extendable', {
  beforeEach() {
    this.build = () => {
      let opts = null;
      return {
        result: () => opts,
        subject: extendable(opts_ => opts = opts_)
      };
    }
  }
});

test('sanity', function(assert) {
  let { result, subject } = this.build();
  subject.extend(opts => ({ one: true })).extend(opts => ({ two: true }))({ three: true });
  assert.deepEqual(result(), {
    "one": true,
    "three": true,
    "two": true
  });
});

test('extend overrides unknown property', function(assert) {
  let { result, subject } = this.build();
  subject.extend(opts => ({ id: 'one' })).extend(opts => ({ id: 'two' }))({});
  assert.deepEqual(result(), {
    id: 'two'
  });
});
