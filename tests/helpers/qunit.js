import Ember from 'ember';
import extendAssert from './extend-assert';
import {
  test as test_,
  only as only_,
  todo as todo_,
  skip
} from 'ember-qunit';

const {
  Logger: { error }
} = Ember;

const wrap = q => function(name, fn) {
  return q(name, async function(assert) {
    assert = extendAssert(assert);
    try {
      return await fn.call(this, assert);
    } catch(e) {
      error(e && e.stack || e);
      throw e;
    }
  });
};

export const test = wrap(test_);
export const only = wrap(only_);
export const todo = wrap(todo_);

test.skip = skip;
test.only = only;
test.todo = todo;
