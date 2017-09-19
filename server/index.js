/* eslint-env node */
'use strict';

module.exports = function(app) {
  const path        = require('path');
  const globSync    = require('glob').sync;
  const mocks       = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  const proxies     = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);
  const serveStatic = require('serve-static');

  const morgan = require('morgan');
  app.use(morgan('dev'));

  const coverage = serveStatic(path.join(__dirname, '../coverage'), { 'index': [ 'index.html' ] });
  app.use('/coverage', coverage);

  mocks.forEach(route => route(app));
  proxies.forEach(route => route(app));
};
