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
  this.route('blog', function() {
    this.route('authors', function() {
      this.route('author', { path: '/:author_id'}, function() {
      });
    });
    this.route('blogs', function() {
      this.route('blog', { path: '/:blog_id'}, function() {
      });
    });
  });
  this.route('documents', function() {
    this.route('document', { path: '/:doc_id' }, function() {
    });
  });
  this.route('setup', function() {
  });
});

export default Router;
