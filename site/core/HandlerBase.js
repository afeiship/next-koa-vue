(function (nx, global) {

  var HttpClient = require('./HttpClient');

  module.exports = nx.declare({
    extends: HttpClient,
    methods: {
      getMethod: function () {
        return (this.koa.req.method).toUpperCase();
      },
      getQuery: function () {
        var method = this.getMethod();
        return method === 'GET' ? this.koa.query : this.koa.request.body;
      }
    }
  });

}(nx, nx.GLOBAL));
