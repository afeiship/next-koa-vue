var koa = require('koa'),
  _ = require('underscore'),
  url = require('url'),
  path = require('path'),
  koaBody = require('koa-body'),
  koaError = require('koa-onerror'),
  env = require('./middlewarelist/env'),
  jade = require('./middlewarelist/jade'),
  cache = require('./middlewarelist/cache'),
  packageJSON = require('./config.json'), // 业务流程缓存
  app;

/**
 * @port {number} 监听端口号
 */
module.exports = function (port) {
  app = koa();
  app.keys = ['user app is a secret'];

  // 方便多开发环境进行切换
  if (app.env != 'production') {
    if (app.env == 'pre') {
      packageJSON.serverIp = 'pre.' + packageJSON.serverIp;
    } else {
      packageJSON.jadeFolderName = '../src';
      packageJSON.debug = true;
      app.use(env(packageJSON));
    }
  }

  koaError(app);

  /**
   * support params
   */
  app.use(koaBody());

  /**
   * use jade:
   */
  app.use(jade(packageJSON, app));

  /**
   * cache global handler
   */
  app.use(cache(packageJSON));

  /**
   * listen port
   */
  app.listen(port);

  console.log('[ Server start at port ]:' + port + ' env:' + app.env);
};
