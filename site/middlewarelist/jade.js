(function (nx, global) {

  var jade = require('jade'),
    path = require('path'),
    fs = require('fs');

  var Jade = nx.declare({
    statics: {
      cache: {}
    },
    methods: {
      init: function (inApp) {
        this._app = inApp;
      },
      template: function (inName) {
        var config = this._app.config;
        var tmpl = Jade.cache[inName],
          jadeStr = '',
          filePath;

        if (tmpl == null) {
          filePath = path.join(config.pwd, config.jadeFolderName + '/', inName + '.jade');
          if (fs.existsSync(filePath)) {
            jadeStr = fs.readFileSync(filePath);
            tmpl = Jade.cache[inName] = jade.compile(jadeStr, {
              filename: filePath
            });
          }
        }
        return tmpl;
      },
      getHTML: function (json, templateName) {
        var _jadeFn;
        if (typeof json === 'string') {
          templateName = json;
          json = {};
        }
        _jadeFn = this.template(templateName);
        return _jadeFn ? _jadeFn(json) : '';
      }
    }
  });

  module.exports = function () {
    return function *(next) {
      this.jade = new Jade(this);
      this.jade.koa = this;
      yield next;
    }
  };


}(nx, nx.GLOBAL));
