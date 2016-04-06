var koa = require('koa'),
  _ = require('underscore'),
  cofs = require('co-fs'),
  url = require('url'),
  path = require('path'),
  session = require('koa-generic-session'),
  koaRedis = require('koa-redis'),
  koaBody = require('koa-body'),
  koaError = require('koa-onerror'),
  log = require('./middlewarelist/log'),
  env = require('./middlewarelist/env'),
  jade = require('./middlewarelist/jade'),
  cache = require('./middlewarelist/cache'),
  redis = require('./middlewarelist/redis'),
  business = require('./middlewarelist/business'),
  config = require('./config.json'), // 业务流程缓存
  app;

/**
 * @port {number} 监听端口号
 */
module.exports = function (port) {
  app = koa();
  // 方便多开发环境进行切换
  if (app.env != 'production') {
    if (app.env == 'pre') {
      config.serverIp = 'pre.' + config.serverIp;
    } else {
      config.jadeFolderName = '../src';
      config.debug = true;
      app.use(env(config));
    }
  }

  // 初始化相关的配置信息
  config.busHandlerFolder = process.cwd() + '/' + config.busHandlerFolder + '/';

  app.use(log(config));

  koaError(app);

  app.use(redis(config.redis));

  /*!
   * 启用session服务
   */
  if (typeof config.sessionMaxAge === 'number') {
    app.use(session({
      store: new koaRedis(config.redis),
      cookie: {
        maxAge: config.sessionMaxAge
      }
    }));
  }

  /*!
   * 提供post 获取参数
   */
  app.use(koaBody());

  /*!
   * 启动jade模板引擎
   */
  app.use(jade(config, app));

  /*!
   * 缓存一些全局变量
   * 全局hanlder等
   */
  app.use(cache(config));

  app.use(business(config));

  app.listen(port);

  console.log('server start at port:' + port + ' env:' + app.env);
};
