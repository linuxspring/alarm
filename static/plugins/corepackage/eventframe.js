IWF.plugins['eventframe'] = function () {
    var me = this;
    var currentSelectNode;

    me.addListener('mouseup', function (sender, e) {
        if (e.target != currentSelectNode) {
            currentSelectNode = e.target;
            me.fireEvent('selectchange', currentSelectNode);
        }
    });

    //1秒钟触发一次
    function onTimer() {
        me.fireEvent('timer');
    }

    me.addListener('ready', function () {
        var t = setInterval(onTimer, 500);
    });

//        startX, endX, offsetX,
//        panel, leftX;

//    me.addListener('touchstart', function (key, e) {
//        startX = e.pageX;
//        panel = $(me.main).children(":visible").children(".iwf-main-left");
//        leftX = parseInt(panel.css('margin-left'));
//    });

//    me.addListener('touchmove', function (key, e) {
//        endX = e.pageX;
//        offsetX = endX - startX;
//        //panel.width(180 + offsetX);
//        if (offset > 50 || offsetX < -50) {
//            var x = leftX + offsetX;
//            if (x > 0) x = 0;
//            else if (x < -180) x = -180;
//            panel.css({ "margin-left": x });
//        }
//    });

//    me.addListener('touchend', function (key, e) {
//        //var l = endX - startX;
//        ///*大于一百的横向手势*/
//        //if (l > 100 || l < -100) me.fireEvent('aftertouchend', l);
    //    });
};