(function (nx, global) {

  /**
   * example-module
   * URL： http://scaffold.demo.com/example-module.php?zjtoken=test`test`1
   * WiKi：none.wiki.com
   */
  var HandlerBase = require('../core/HandlerBase'),
    _ = require('underscore');

  module.exports = nx.declare({
    extends: HandlerBase,
    methods: {
      doJob: function *() {
        var method = this.koa.req.method;
        return yield this['do' + method]();
      },
      doGET: function *() {
        var list = yield this.__getProfitList();
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
      __getProfitList: function *(){
        return yield [
          'item1',
          'item2'
        ];
      },
      getProfitList: function * () {
        //http://api.demo.com/v1/store/{store_id}/profit
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
