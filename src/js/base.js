(function( window ){
    var _mv     = {
        getScreenWidth  : function(){
            var _innerWidth     = window.innerWidth ,
                _screenWidth    = window.screen.width;
            if( _innerWidth && _screenWidth ){
                return _innerWidth <= _screenWidth ? _innerWidth : _screenWidth;
            } else {
                return _innerWidth || _screenWidth;
            }
        } ,
        setHtmlDpr  : function(){
            var _w          = this.getScreenWidth() ,
                _scale      = _w / 750 ,
                _fontSize   = ( 60 * _scale ).toFixed( 2 ),
                _html       = document.getElementsByTagName( "html" )[ 0 ];
            _html.style.fontSize    = _fontSize + "px";
            return this;
        }
    };
    _mv.setHtmlDpr();
    if( "addEventListener" in document) {
        document.addEventListener( "DOMContentLoaded" , function() {
            var body = document.body;
            FastClick.attach( body );
            if(/iPhone/.test(navigator.appVersion)) {
                body.classList.add( "ios" );
            }
        }, false );

    }
} )( window );
