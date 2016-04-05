define("UrlHash", ["Base"], function (Base) {
    /*!
     *  urlHash提取/保存 管理
     */
    var UrlHash = Base.extend(function () {
        this.url = window.location.href;
    }, {
        gotoUrl: function (url, params) {
            window.location.href = this.getPageUrl(url, params);
            return this;
        },
        getPageUrl: function (url, params) {
            var _urlHash = [];
            for (var a in params) {
                _urlHash.push(a + "=" + encodeURIComponent(params[a]));
            }
            return _urlHash.length ? ( url + "?" + _urlHash.join("&") ) : url;
        },
        getHash: function () {
            var _self = this,
                _url,
                _keyVal,
                _json = {};
            return this.urlHash || (function () {
                    if (_self.url.indexOf("?") > -1) {
                        _url = _self.url.replace(/.*\?/, "").split("&");
                        for (var i = _url.length; i--;) {
                            _keyVal = _url[i].split("=");
                            _json[_keyVal[0]] = decodeURIComponent(_keyVal[1]);
                        }
                    }
                    _self.urlHash = _json;
                    return _json;
                })();
        },
        parseUrl: (function () {
            var parser = document.createElement('a');
            return function (inUrl) {
                parser.href = inUrl;
                return {
                    protocol: parser.protocol,
                    host: parser.host,
                    hostname: parser.hostname,
                    port: parser.port,
                    pathname: parser.pathname,
                    search: parser.search,
                    hash: parser.hash
                };
            }
        }()),
        toQueryString: function (inJson) {
            if (!inJson) {
                return '';
            }
            return Object.keys(inJson).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(inJson[key]);
            }).join('&');
        },
        toJson: function (inObj) {
            return JSON.parse(
                JSON.stringify(inObj)
            );
        },
        getUrlHash: function (inSearchStr) {
            var searchStr = inSearchStr || location.search;
            var pairs = searchStr.slice(1).split('&');
            var result = {}, pair;
            $.each(pairs, function (_, val) {
                pair = val.split('=');
                if (pair[0]) {
                    result[pair[0]] = decodeURIComponent(pair[1] || '');
                }
            });
            return this.toJson(result);
        }
    });
    return UrlHash;
});