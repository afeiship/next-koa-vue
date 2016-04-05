require('./common/next-js-core2')(require);
nx.require([
  'cluster',
  'os',
  './server'
], function (cluster, os, server) {
  return nx.declare({
    statics: {
      init: function () {
        if (cluster.isMaster) {
          if (process.env.NODE_ENV === 'production') {
            var length = os.cpus().length;
            for (var i = length / 2; i--;) {
              this.setupWorker();
            }
          } else {
            this.setupWorker();
          }
        } else if (cluster.isWorker) {
          server(process.argv[process.argv.length - 1]);
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
