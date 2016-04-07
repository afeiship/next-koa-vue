(function (nx, global) {

  var url = require('url');
  var Boot = nx.declare({
    properties: {
      pwd: {
        get: function () {
          return process.cwd();
        }
      },
      handlerName: {
        get: function () {
          var urls = url.parse(this._app.originalUrl),
            pathname = urls.pathname,
            lastDotIndex = pathname.lastIndexOf('.');
          return pathname.slice(1, lastDotIndex);
        }
      }
    },
    methods: {
      init: function (inApp) {
        this._app = inApp;
      }
    }
  });


  module.exports = function (inConfig) {
    return function * (next) {
      var boot = new Boot(this);
      this.config = nx.mix(boot.gets(), inConfig);
      yield next;
    };
  };

}(nx, nx.GLOBAL));

