import module from '../../tests/helpers/module-for-acceptance';
import { test } from '../helpers/qunit';
import { visit, currentURL } from 'ember-native-dom-helpers';

module('Acceptance | index');

test('visiting /', async function(assert) {
  await visit('/');
  assert.equal(currentURL(), '/');
});
