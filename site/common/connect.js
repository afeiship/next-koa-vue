var http = require("http"),
  _ = require("underscore"),
  QueryString = require("querystring"),
  path = require("path"),
  Connect;


module.exports = nx.declare({
  methods: {
    init: function (inKoa) {
      this.koa = inKoa;
    },
    getConnectOpts: function (url, type, opt) {
      if (typeof opt !== "object") {
        opt = {}
      }
      return {
        hostname: opt.host || this.koa.cache.packageJSON.serverIp,
        port: opt.port || this.koa.cache.packageJSON.serverPort,
        path: opt.pathName || url,
        method: type || "GET",
        headers: _.extend({
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": this.koa.session && this.koa.session.serverCookie ? this.koa.session.serverCookie : ""
        }, opt.headers || {})
      };
    },
    post: function (url, postData, opt) {
      var _self = this,
        _cb,
        _result,
        _called,
      // _dataStr    = "data=" + JSON.stringify( postData ) ,
        _dataStr = QueryString.stringify(postData),
        _done = function () {
          if (!_called && _result !== undefined && _cb) {
            _cb.call(this, null, JSON.parse(_result));
            _called = true;
          }
        },
        _req,
        _url;
      _req = http.request(_self.getConnectOpts(url, "POST", opt), function (res) {
        var _data = "";
        if (res.statusCode === 200) {
          res.on("data", function (chunk) {
            _data += chunk;
          }).on("end", function () {
            _result = String(_data);
            _done();
          });
        }
      });
      _req.on("error", function (e) {
        _self.log(e.massage || e);
        _result = JSON.stringify({error: -9});
        _done();
      });
      _req.write(_dataStr);
      _req.end();
      return function (fn) {
        _cb = fn;
        _done();
      }
    },
    getParamData: function (params) {
      var _al = [];
      for (var a in params) {
        _al.push(a + "=" + encodeURIComponent(params[a]));
      }
      return _al.join("&");
    },
    get: function (url, paramData, opt) {
      var _self = this,
        _cb,
        _result,
        _called,
        _done = function () {
          if (!_called && _result !== undefined && _cb) {
            _cb.call(this, null, ( _result ? JSON.parse(_result) : _result ));
            _called = true;
          }
        },
        _getData = function (res) {
          var _data = "";
          if (res.statusCode === 200) {
            res.on("data", function (chunk) {
              _data += chunk;
            }).on("end", function () {
              _result = String(_data);
              _done();
            });
          }
        },
        _req;
      if (typeof paramData === "object" && paramData !== null) {
        url += "?" + this.getParamData(paramData);
      }
      url = "/" + url;
      _req = http.request(_self.getConnectOpts(url, "GET", opt), function (res) {
        _getData(res);
      });
      _req.on("error", function (e) {
        _self.log(e);
        _result = JSON.stringify({error: -9});
        _done();
      });
      _req.end();
      return function (fn) {
        _cb = fn;
        _done();
      }
    },
    getQuery: function () {
      return this.koa.req.method === "GET" ? this.koa.query : this.koa.request.body;
    },
    setKoa: function (koa, handlerName) {
      this.koa = koa;
      this.jade = koa.jade;
      return this;
    }
  }
});
