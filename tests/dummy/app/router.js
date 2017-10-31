import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('session', function() {
    this.route('new');
    this.route('delete');
  });
  this.route('documents', function() {
    this.route('document', { path: '/:doc_id' }, function() {
    });
  });
  this.route('setup', function() {
  });
});

export default Router;
