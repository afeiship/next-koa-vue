(function (nx, global) {

  var url = require('url');
  var fs = require('fs');
  var path = require('path');

  var Business = nx.declare({
    statics: {
      handlerCache: {}
    },
    methods: {
      init: function (inApp) {
        this._app = inApp;
        this._handlerClass = null;
      },
      loadHandlerClass: function () {
        var config = this._app.config;
        var handlerName = config.handlerName;
        var filePath = path.join(config.pwd, config.busHandlerFolder, handlerName + '.js');
        var HandlerClass;
        if (!fs.existsSync(filePath)) {
          return this.status = 404;
        } else {
          HandlerClass = require(filePath);
          console.log(this._app);
          Business.handlerCache[handlerName] = this._handlerClass = new HandlerClass(this._app);
        }
      },
      resolveResponse: function * () {
        var app = this._app;
        try {
          //todo:buggy code:
          this._handlerClass.setKoa(app);
          console.log(app);
          app.body = yield this._handlerClass.doJob() || '';
        } catch (_) {
          console.dir(_);
          app.status = 500;
          app.statusText = '[Node server error:500]';
        }
      }
    }
  });


  module.exports = function () {
    return function * (next) {
      var business = new Business(this);
      business.loadHandlerClass();
      yield business.resolveResponse();
      yield next;
    };
  };


}(nx, nx.GLOBAL));







