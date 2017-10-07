/*jshint node:true*/
'use strict';

let pkg = require('../package');

module.exports = function(/* environment, appConfig */) {
  return {
    documents: {
      name: pkg.name,
      version: pkg.version
    }
  };
};
