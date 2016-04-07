var Base = require("./base"),
  Connect = require("./connect"),
  _ = require("underscore"),
  HandlerBase;

HandlerBase = Base.extend(function () {

}, {
  extend: Connect,
  getQuery: function () {
    return this.koa.req.method === "GET" ? this.koa.query : this.koa.request.body;
  },
  setKoa: function (koa, handlerName) {
    this.koa = koa;
    this.jade = koa.jade;
    return this;
  }
});

module.exports = HandlerBase;
