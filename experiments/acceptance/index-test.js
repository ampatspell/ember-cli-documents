import module from '../../tests/helpers/module-for-acceptance';
import { test } from '../helpers/qunit';

module('Acceptance | index');

test.skip('visiting /', function(assert) {
  visit('/');
  andThen(() => assert.equal(currentURL(), '/'));
});
