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
          filePath = path.join(config.pwd, config.jadeFolderName + '/', inName + '.jade');

        if (tmpl == null && fs.existsSync(filePath)) {
          tmpl = Jade.cache[inName] = jade.compileFile(filePath);
        }
        return tmpl;
      },
      getHTML: function (inName, inData) {
        var jadeFn = this.template(inName);
        var data = inData || {};
        return jadeFn(data) || '';
      }
    }
  });

  module.exports = function () {
    return function *(next) {
      this.jade = new Jade(this);
      yield next;
    }
  };


}(nx, nx.GLOBAL));
