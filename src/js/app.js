require( [ "ModalView" ] , function( MV ){
    var _mv;
    window.$app    = {
            screenHeight    : window.innerHeight || window.screen.height ,
            screenWidth     : window.innerWidth || window.screen.width 
        };
    _mv     = new MV( "app" , $( document.body ) , function(){
        this.$container.height( $app.screenHeight );
    } , {

    } );
    _mv.init();
} )