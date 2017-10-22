/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    addons: {
      blacklist: [ 'ember-cli-fastboot' ]
    }
  });
  return app.toTree();
};
