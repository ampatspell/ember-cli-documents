import { skip } from 'ember-qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | index');

skip('visiting /', function(assert) {
  visit('/');
  andThen(() => assert.equal(currentURL(), '/'));
});
