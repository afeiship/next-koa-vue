module.exports  = {
    isPhone     : function( phone ){
        return /1[3|4|5|7|8]\d{9}/.test( phone );
    },
    isEmpty		: function( str ){
    	return /\S/.test( str );
    }
};