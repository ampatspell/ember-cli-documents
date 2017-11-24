import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
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
      this.route('new');
      this.route('author', { path: '/:author_id'}, function() {
      });
    });
    this.route('blogs', function() {
      this.route('blog', { path: '/:blog_id'}, function() {
      });
    });
  });
  this.route('setup', function() {
  });
});

export default Router;
