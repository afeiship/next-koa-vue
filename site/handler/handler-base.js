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

    request: function (inUrl, inType, inData, inOptions) {
      var self = this;
      var type = inType || 'GET';
      var dataStr = QueryString.stringify(inData);
      var result;
      var url = type === 'GET' ? (inUrl + '?' + dataStr) : inUrl;
      var options = this.getRequestOptions(url, type, inOptions);
      console.log(options);
      var req = http.request(options, function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
          chunks.push(chunk);
        }).on('end', function () {
          if (res.statusCode === 200) {
            result = iconv.decode(Buffer.concat(chunks), 'utf-8');
          } else {
            self.onRequestError(res);
          }
        });
      });
      req.on('error', function (res) {
        self.onRequestError(res);
      });
      req.write(dataStr);
      req.end();


      return function (callback) {
        console.log('result:->',result);
        callback.call(this, null, JSON.parse(result || null));
      };
    },
    onRequestError: function (inRes) {
      console.log(inRes);
    },
    post: function (url, postData, opt) {
      var _self = this,
        _callback,
        _result,
        _called,
      // _dataStr    = 'data=' + JSON.stringify( postData ) ,
        _dataStr = QueryString.stringify(postData),
        _done = function () {
          if (!_called && _result !== undefined && _callback) {
            _callback.call(this, null, JSON.parse(_result));
            _called = true;
          }
        },
        _req,
        _url;
      _req = http.request(_self.getRequestOptions(url, 'POST', opt), function (res) {
        var _data = '';
        if (res.statusCode === 200) {
          res.on('data', function (chunk) {
            _data += chunk;
          }).on('end', function () {
            _result = String(_data);
            _done();
          });
        }
      });
      _req.on('error', function (e) {
        _self.log(e.massage || e);
        _result = JSON.stringify({error: -9});
        _done();
      });
      _req.write(_dataStr);
      _req.end();
      return function (fn) {
        _callback = fn;
        _done();
      }
    },
    get: function (url, paramData, opt) {
      var _self = this,
        _callback,
        _result,
        _called,
        _dataStr = '',
        _done = function () {
          if (!_called && _result !== undefined && _callback) {
            _callback.call(this, null, ( _result ? JSON.parse(_result) : _result ));
            _called = true;
          }
        },
        _getData = function (res) {
          var _data = '';
          if (res.statusCode === 200) {
            res.on('data', function (chunk) {
              _data += chunk;
            }).on('end', function () {
              _result = String(_data);
              _done();
            });
          }
        },
        _req;
      if (typeof paramData === 'object' && paramData !== null) {
        _dataStr = QueryString.stringify(paramData);
        url += '?' + _dataStr;
      }
      url = '/' + url;
      _req = http.request(_self.getRequestOptions(url, 'GET', opt), function (res) {
        _getData(res);
      });
      _req.on('error', function (e) {
        _self.log(e);
        _result = JSON.stringify({error: -9});
        _done();
      });
      _req.write(_dataStr);
      _req.end();
      return function (fn) {
        _callback = fn;
        _done();
      }
    },
    getQuery: function () {
      return this.koa.req.method === 'GET' ? this.koa.query : this.koa.request.body;
    }
  }
});
