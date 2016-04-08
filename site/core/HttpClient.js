(function (nx,global) {

  var http = require('http'),
    _ = require('underscore'),
    QueryString = require('querystring'),
    path = require('path'),
    iconv = require('iconv-lite');


  module.exports = nx.declare({
    methods: {
      init: function (inKoa) {
        this.koa = inKoa;
        this.jade = inKoa.jade;
      },
      REQUEST: function (inUrl, inType, inData, inOptions) {
        var self = this;
        var type = inType || 'GET';
        var dataStr = QueryString.stringify(inData);
        var result, called, callback;
        var url = type === 'GET' ? (inUrl + '?' + dataStr) : inUrl;
        var options = this.getRequestOptions(url, type, inOptions);
        var done = function () {
          if (!called && result !== undefined && callback) {
            callback.call(this, null, JSON.parse(result));
            called = true;
          }
        };
        var req = http.request(options, function (res) {
          var chunks = [];
          res.on('data', function (chunk) {
            chunks.push(chunk);
          }).on('end', function () {
            if (res.statusCode === 200) {
              result = iconv.decode(Buffer.concat(chunks), 'utf-8');
              done();
            } else {
              self.onRequestError(res);
              done();
            }
          });
        });
        req.on('error', function (res) {
          self.onRequestError(res);
          done();
        });
        req.write(dataStr);
        req.end();


        return function (fn) {
          callback = fn;
          done();
        }
      },
      GET: function (inUrl, inParamData, inOptions) {
        return this.REQUEST(inUrl, 'GET', inParamData, inOptions);
      },
      POST: function (inUrl, inPostData, inOptions) {
        return this.REQUEST(inUrl, 'POST', inPostData, inOptions);
      },
      getRequestOptions: function (inUrl, inType, inOptions) {
        var options = inOptions || {};
        var config = this.koa.config;
        return {
          hostname: options.host || config.serverIp,
          port: options.port || config.serverPort,
          path: inUrl,
          method: inType || 'GET',
          headers: nx.mix({
            //'Content-Type': 'application/x-www-form-urlencoded'
          }, options.headers || {})
        };
      },
      onRequestError: function (inRes) {
        console.log(inRes);
      }
    }
  });

}(nx,nx.GLOBAL));
