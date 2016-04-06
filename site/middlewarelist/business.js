var url = require('url');
var fs = require('fs');
var path = require('path');

module.exports = function (inConfig) {
  return function* (next) {
    var originalUrl = url.parse(this.originalUrl),

      handler = originalUrl.pathname.replace(/[\\|\/](.*)\..*/, '$1'),
      handlersCache = this.cache.getCacheData('handlersCache'),
      self = this,
      handlerFilePath,
      requireClass,
      isFileExists;
    // 获取具体对应的业务，并实例化执行，对于已实例化的业务，直接进行业务处理
    if (!handlersCache[handler] || inConfig.debug) {
      isFileExists = fs.existsSync(inConfig.busHandlerFolder + handler + '.js');
      console.log(isFileExists);

      if (isFileExists) {
        handlerFilePath = inConfig.busHandlerFolder + handler;
        console.log(path.resolve(handlerFilePath));
      } else {
        return this.status = 404;
      }

      requireClass = require(handlerFilePath);

      handlersCache[handler] = new requireClass(this);
    }

    try {
      //todo:这句感觉没有什么用
      handlersCache[handler].setKoa(this);
      self.body = yield handlersCache[handler].doJob();
      if (self.body === undefined) {
        self.redirect('/');
        self.body = '';
      }
    } catch (e) {
      if (inConfig.debug) {
        console.log(e);
      }
      self.status = 500;
      self.statusText = 'Node server error';
    }

    yield next;
  };
};





