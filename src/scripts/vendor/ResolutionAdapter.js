(function (nx, global) {

  var document = global.document;
  var root = document.documentElement;
  var navigator = global.navigator;
  var isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  var resizeEvt = 'orientationchange' in global ? 'orientationchange' : 'resize';

  nx.declare({
    statics: {
      init: function () {
        var dpr = isIOS ? Math.min(global.devicePixelRatio, 3) : 1,
          dpr = global.top === global.self ? dpr : 1;
        root.dataset.dpr = dpr;
        this.reCalculate();
        if (!doc.addEventListener) return;
        global.addEventListener(resizeEvt, this.reCalculate, false);
      },
      reCalculate: function () {
        var width = root.clientWidth;
        if (width / dpr > 750) {
          width = 750 * dpr;
        }
        root.dataset.width = width;
        root.dataset.percent = 100 * (width / 750);
        root.style.fontSize = 100 * (width / 750) + 'px';
      }
    }
  });

}(nx, nx.GLOBAL));
