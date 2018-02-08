import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('document', { path: '/document/:store_identifier/:database_identifier/:document_id' });
  this.route('session', function() {
    this.route('new');
    this.route('delete');
  });
  this.route('setup', function() {
  });
});

export default Router;
