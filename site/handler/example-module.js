(function (nx, global) {

  /**
   * example-module
   * 商家版通用token test`test`1
   * URL： http://scaffold.zaijiadd.com/example-module.php?zjtoken=test`test`1
   * WiKi：none.wiki.com
   */
  var HandlerBase = require('../core/HandlerBase'),
    _ = require('underscore');

  module.exports = nx.declare({
    extend: HandlerBase,
    methods: {
      doJob: function *() {
        var method = this.koa.req.method;
        return yield this['do' + method]();
      },
      doGET: function *() {
        var list = yield this.getProfitList();
        return this.jade.getHTML(
          'example-module',
          {
            title: 'test-fei',
            dataString: JSON.stringify({
              list: list
            })
          }
        );
      },
      doPOST: function * () {
        var query = this.getQuery();
        return yield function () {
          return 1;
        }
      },
      getProfitList: function * () {
        //http://api.zaijiadd.com/v1/store/{store_id}/profit
        var query = this.getQuery();
        return yield this.GET('/v1/store/7/coffers_log', null, {
          headers: {
            zjtoken: decodeURIComponent(query.zjtoken)
          }
        });
      }
    }
  });


}(nx, nx.GLOBAL));
