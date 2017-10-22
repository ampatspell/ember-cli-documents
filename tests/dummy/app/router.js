import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('experimental', function() {});
  this.route('paginated', function() {});
  this.route('message', function() {});
  this.route('blank', function() {});
});

export default Router;
