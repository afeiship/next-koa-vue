define( "Lottery" , [ "Base" , "Ajax" , "EventBind" ] , function( Base , Ajax , EB ){

    var Lottery = Base.extend( function( opts ){
        this.opts = $.extend( {
            index  : 0,
            timer  : 0,             //定时器的ID
            times  : 0,             //已转动的次数
            speed  : 120,           //转速
            cycle  : 40,            //至少转动的次数
            query  : 0,             //服务端返回的奖品ID
            award  : -1,            //奖品ID
            number : 0,             //已抽奖次数
            raffle : 1              //可抽奖次数，默认应该为1
        }, opts );

        this.init();
    } , {
        extend: Ajax,
        init: function(){
            var self = this;
            this.doTipsAndBtn();
            new EB( {
                ".lottery-btn span::tap": function(){
                    self.lotteryBtn = self.lotteryBtn || $( ".lottery-btn span" );

                    if (self.opts.timer === 0 && self.lotteryBtn.text() != "下单抽奖") {
                        self.opts.times = 0;
                        self.opts.speed = 100;
                        self.getAward();
                        self.roll();
                    }
                } ,
                ".view-back-btn span::tap": function(){
                    if (typeof self.opts.showSlide === "function") {
                        self.opts.showSlide();
                    }
                }
            } );
        },
        getAward: function(){
            var self = this;
            this.pipe( "new-year-2016-lottery.php" , {
                zjtoken         : this.opts.zjtoken,
                action          : "getprize",
                query           : "is_yes",
                time            : this.fmtDate( new Date() , "yyyy-M-d-h-m" ).replace( /-/g , "" )
            }, "post" ).then( function( rtn ){
                self.opts.query = rtn.data.query;
                self.opts.recordId = rtn.data.id;
                self.opts.award = self.query2award( rtn.data.query );
            } );
        },
        //随机返回 0 或 1
        getZeroOrOne: function() {
            return Math.floor( Math.random( 10 ) * 10e10 ) % 2;
        },
        //对应转换服务端的奖品ID，并做好随机显示
        query2award: function( query ) {
            var rtn;
            switch ( query ){
                case 0:         //谢谢参与
                    rtn = [ 3 , 7 ][ this.getZeroOrOne() ]; //随机显示3或7
                    break;
                case 1:         //iPad mini
                    rtn = 2;
                    break;
                case 2:         //小米电源
                    rtn = 6;
                    break;
                case 3:         //点点吉祥玩偶
                    rtn = 5;
                    break;
                case 4:         //点点抱枕
                    rtn = 1;
                    break;
                case 5:         //八折优惠券
                    rtn = [ 4 , 8 ][ this.getZeroOrOne() ]; //随机显示4或8
                    break;
            }
            return rtn;
        },
        /**
         * 对日期进行格式化
         * @param date 要格式化的日期
         * @param format 进行格式化的模式字符串
         *     支持的模式字母有：
         *     y:年,
         *     M:年中的月份(1-12),
         *     d:月份中的天(1-31),
         *     h:小时(0-23),
         *     m:分(0-59),
         *     s:秒(0-59),
         *     S:毫秒(0-999),
         *     q:季度(1-4)
         */
        fmtDate: function( date , format ){
            if(format === undefined){
                format = date;
                date = new Date();
            }
            var map = {
                "M": date.getMonth() + 1, //月份
                "d": date.getDate(), //日
                "h": date.getHours(), //小时
                "m": date.getMinutes(), //分
                "s": date.getSeconds(), //秒
                "q": Math.floor( (date.getMonth() + 3) / 3 ), //季度
                "S": date.getMilliseconds() //毫秒
            };
            format = format.replace( /([yMdhmsqS])+/g , function( all , t ){
                var v = map[t];
                if(v !== undefined){
                    if(all.length > 1){
                        v = "0" + v;
                        v = v.substr( v.length-2 );
                    }
                    return v;
                } else if(t === "y"){
                    return ( date.getFullYear() + "" ).substr( 4 - all.length );
                }
                return all;
            } );
            return format;
        },
        highlight: function(){
            var index = this.opts.index;
            $( ".item-" + index ).removeClass( "active" );
            index = index > 8 ? 1 : index + 1;
            $( ".item-" + index ).addClass( "active" );
            this.opts.index = index;
        },
        //一次抽奖开始，转动动画
        roll: function(){
            var self = this,
                speed = this.opts.speed;

            this.opts.times += 1;
            this.highlight();

            if (this.opts.times > this.opts.cycle && this.opts.index === this.opts.award && this.opts.award > -1) { //一次抽奖结束
                this.opts.timer = 0;
                this.opts.raffle -= 1;
                this.opts.number += 1;
                clearTimeout( this.opts.timer );

                //显示奖品
                if (typeof this.opts.showPrize === "function") {
                    setTimeout(function () {
                        self.opts.showPrize( self.opts.query , self.opts.recordId );
                        self.doTipsAndBtn();
                    }, 1200 );
                }
            } else {
                if (this.opts.times > this.opts.cycle - 15) {
                    this.opts.speed = speed > 180 ? speed : speed + 10;   //减速
                } else {
                    this.opts.speed = speed > 50 ? speed - 5 : speed;     //加速
                }
                this.opts.timer = setTimeout( function() {
                    self.roll.call( self )
                } , this.opts.speed );
            }
        },
        doTipsAndBtn: function(){
            var btn,
                tips,
                raffle = this.opts.raffle,
                number = this.opts.number;

            tips = this.lotteryTips = this.lotteryTips || $( ".lottery-tips" );
            btn = this.lotteryBtn = this.lotteryBtn || $( ".lottery-btn span" );

            if (raffle > 0) {
                btn.removeClass( "disabled" );
                if (number > 0) {
                    btn.text( "再抽一次" );
                }
                tips.html( "<span class=single>您还有<b>" + raffle + "</b>次抽奖机会</span>" ).show();
            } else {
                btn.addClass( "disabled" ).text( "下单抽奖" );
                tips.html( "<span class=multi>今天每下一笔30元以上的订单<br>发货后您就能获得一次抽奖机会</span>" ).show();
            }
        }
    } );

    return Lottery;
} );