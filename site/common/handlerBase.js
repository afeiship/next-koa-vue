var Base        = require( "./base" ) ,
    Connect     = require( "./connect" ) ,
    _           = require( "underscore" ) ,
    HandlerBase;

HandlerBase     = Base.extend( function(){

} , {
    extend      : Connect,
    log         : function( str ){
        this.koa.log.log( str );
        return this;
    } ,
    getWithHeader   : function *( url , params , headers ){
        return yield this.get( url , params , _.extend( this.getRequestOpt() , headers ) );
    } ,
    postWithHeader   : function *( url , params , headers ){
        return yield this.post( url , params , _.extend( this.getRequestOpt() , headers ) );
    } ,
    getRequestOpt   : function(){
        var _query  = this.getQuery();
        return {
                headers : {
                    zjtoken  : decodeURIComponent( _query.zjtoken ).replace( /\s/gi , "+" )
                }
            }
    } ,
    getQuery    : function(){
        return this.koa.req.method === "GET" ? this.koa.query : this.koa.request.body;
    } ,
    gotoDownload    : function(){
        this.koa.redirect( "http://d.zaijiadd.com" );
        return "";
    } ,
    /*!
     *  为业务类赋值一些通配属性
     */
    setKoa      : function( koa , handlerName ){
        this.koa                = koa;
        this.jade               = koa.jade;
        return this;
    } ,
    /*!
     *  验证用户登录
     */
    hasLogin    : function(){
        var _query  = this.koa.method === "GET" ? this.koa.query : this.koa.request.body;
        if( _query.zjtoken || _query.token ){
            return true;
        }
        return false;
    }
} );

module.exports  = HandlerBase;