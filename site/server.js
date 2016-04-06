var koa = require('koa'),
  url = require('url'),
  path = require('path'),
  session = require('koa-generic-session'),
  koaRedis = require('koa-redis'),
  koaBody = require('koa-body'),
  boot = require('./middlewarelist/boot'),
  jade = require('./middlewarelist/jade'),
  cache = require('./middlewarelist/cache'),
  redis = require('./middlewarelist/redis'),
  business = require('./middlewarelist/business'),
  config = require('./config.json');

/**
 * @port {number} 监听端口号
 */
module.exports = function (port) {


  //init koa & set config:
  var app;
  app = koa();

  app.use(boot(config));

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
