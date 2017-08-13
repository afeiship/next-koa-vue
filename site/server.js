var koa = require('koa'),
  url = require('url'),
  path = require('path'),
  koaBody = require('koa-body'),
  boot = require('./middleware/boot'),
  jade = require('./middleware/jade'),
  business = require('./middleware/business'),
  redis = require('./middleware/redis'),
  config = require('./config.json');

/**
 * @port {number} port number:
 */
module.exports = function (port) {

  //init koa & set config:
  var app;
  app = koa();

  app.use(boot(config));

  app.use(koaBody());

  app.use(jade());

  app.use(business());

  // app.use(redis());

  app.listen(port);

  console.log('server start at port:' + port + ' env:' + app.env);
};
