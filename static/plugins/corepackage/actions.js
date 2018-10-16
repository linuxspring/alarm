//IWF.plugins['actions'] = function () {
//    var me = this;

//    /*左边导航动画效果*/
//    me.commands['leftaction'] = {
//        execCommand: function (key, arg) {
//            if (arg.width() == 0) arg.animate({ width: 180 });
//            else arg.animate({ width: 0 });
//        }
//    };

//    /*退出登录*/
//    me.commands['logout'] = {
//        execCommand: function (key, arg) {
//            $.getJSON("login.data?action=logout", { sid: me.sid, _tempid: utils.guid() }, function (json) {
//                me.document.location.href = "index.html";
//            });
//        }
//    }
//};