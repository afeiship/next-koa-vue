require('./common/next-js-core2')(require);
(function (nx, global) {

  var env = process.env.NODE_ENV,
    port = process.argv[process.argv.length - 1];

  nx.require([
    'cluster',
    'os',
    './server'
  ], function (cluster, os, server) {
    return nx.declare({
      statics: {
        init: function () {
          if (cluster.isMaster) {
            if (env === 'production') {
              var length = os.cpus().length;
              for (var i = length / 2; i--;) {
                this.setupWorker();
              }
            } else {
              this.setupWorker();
            }
          } else if (cluster.isWorker) {
            server(port);
          }
        },
        setupWorker: function () {
          cluster.fork().on('exit', function () {
            console.log('exit');
          });
        }
      }
    });
  });

}(nx, nx.GLOBAL));
