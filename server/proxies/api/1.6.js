/* eslint-env node */
'use strict';

module.exports = app => {
  let proxy = require('http-proxy').createProxyServer({});
  proxy.on('error', (err, req) => {
    console.error(err, req.url);
  });
  app.use('/api/1.6', (req, res, next) => {
    proxy.web(req, res, { target: `http://${req.hostname}:6016` });
  });
};
