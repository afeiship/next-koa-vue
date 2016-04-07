/**
 * example-module
 * 商家版通用token test`test`1
 * URL： http://scaffold.zaijiadd.com/example-module.php?zjtoken=test`test`1
 * WiKi：none.wiki.com
 */
var Connect = require('../common/connect'),
  _ = require('underscore');

module.exports = nx.declare({
  extend: Connect,
  methods: {
    doJob: function *() {
      var method = this.koa.req.method;
      return yield this['do' + method]();
    },
    doGET: function *() {
      return this.jade.getHTML(
        'example-module',
        {
          dataString: JSON.stringify({})
        }
      );
    },
    doPOST: function * () {
      var query = this.getQuery();
      return yield function () {
        return 1;
      }
    }
  }
});
