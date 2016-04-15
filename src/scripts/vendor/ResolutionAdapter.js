(function (nx, global) {

  var document = global.document;
  var root = document.documentElement;
  var navigator = global.navigator;
  var isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  var resizeEvt = 'orientationchange' in global ? 'orientationchange' : 'resize';

  nx.declare({
    statics: {
      dpr: 1,
      init: function () {
        var dpr = this._dpr = isIOS ? Math.min(global.devicePixelRatio, 3) : 1;
        this._dpr = global.top === global.self ? dpr : 1;
        root.dataset.dpr = dpr;
        this.reCalculate();
        if (!document.addEventListener) return;
        global.addEventListener(resizeEvt, this.reCalculate, false);
      },
      reCalculate: function () {
        var width = root.clientWidth;
        if (width / this._dpr > 750) {
          width = 750 * this._dpr;
        }
        root.dataset.width = width;
        root.dataset.percent = 100 * (width / 750);
        root.style.fontSize = 100 * (width / 750) + 'px';
      }
    }
  });

}(nx, nx.GLOBAL));
