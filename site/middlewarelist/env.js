/**
 * 测试版APP，切换API时，H5对应切换
 * 通过URL参数zjenv，切换到对应环境
 * API环境列表：http://test.cfg.zaijiadd.com/env.json
 */
var http = require("http");

function getEnvList() {
    var callback, result, called;

    function done() {
        if (!called && result != undefined && callback) {
            result = JSON.parse(result);
            callback.call(this, null, result.data.list);
            called = true;
        }
    }

    http.get('http://test.cfg.zaijiadd.com/env.json', function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        }).on('end', function() {
            result = body;
            if (res.statusCode === 200) {
                done();
            }
        });
    }).on('error', function(e) {
        console.log(e);
    }).end();

    return function(fn) {
        callback = fn;
        done();
    };
}

module.exports = function(packageJSON) {
    return function* (next) {
        var envList = yield getEnvList(),
            zjenv = this.query['zjenv'];

        for (var i = 0, env; env = envList[i]; i++) {
            if (env.name == zjenv) {
                packageJSON.serverIp = env['domain_list']['zjdd_api_online']['domain'];
                break;
            }
        }

        yield next;
    }
};
