(function (nx, global) {

  var rediz = require("redis"),
    coRedis = require("co-redis");

  var Redis = nx.declare({
    methods: {
      init: function (inApp) {
        this._app = inApp;
        this.create()
      },
      create: function () {
        var instance = rediz.createClient(this._app.config.redis);
        return coRedis(instance);
      }
    }
  });

  module.exports = function () {
    return function * (next) {
      this.reids = new Redis(this);
      yield next;
    };
  };

}(nx, nx.GLOBAL));


