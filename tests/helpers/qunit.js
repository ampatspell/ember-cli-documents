import extendAssert from './extend-assert';
import {
  test as test_,
  only as only_,
  skip
} from 'ember-qunit';

const wrap = q => function(name, fn) {
  return q(name, function(assert) {
    assert = extendAssert(assert);
    return fn.call(this, assert);
  });
};

export const test = wrap(test_);
export const only = wrap(only_);

test.skip = skip;
test.only = only;
