IWF.plugins['itemMz'] = function () {

    var me = this;

    var nav = {icon: 'icon-briefcase', title: '事件单', a: 'itemMz', b: 'itemMz', index: 2, canClose: true};
    var url = me.rootPath + 'zq_todo/ocmq.do';
    var userName = me.options.userInfo.name; //me.options.userInfo.name
    var solveTodoUrl = me.rootPath + 'mz_gps/saveTodo.do';
    var positionSwitch = me.options.userInfo.positionSwitch;

    me.addListener('init', function () {
        me.execCommand('addnav', nav);
        me.execCommand('addtab', nav);
    });


    var caseConfig = {
        del: function (sender) {
            DelBact(sender.data);
        }, send: function (sender) {
            SendCase(sender.data);
        }, back: function (sender) {
            SendBack(sender.data);
        }, turnback: function (sender) {
        }, detail: function (sender) {
            CaseDetail(sender.data);
        }
    }


    function SendBack(item) {
        var data = {icon: 'icon-globe', title: '我的待办', a: 'doingcase', b: 'doingcase'};
        me.execCommand('go', data);
    }


    function InitUI(el) {
        el.empty();
        var tplBack = '<div class="header"> <a href="javascript:void(0);" class="back"></a>行项详情' +
            '</div> ';
        me.topTool = $(tplBack).appendTo(el);
        me.topTool.find('a').bind('click', el, function (e) {
            var number = el.find('#id').text();
            var data = {icon: 'icon-globe', title: '事件单列表', a: 'dealingitem', b: 'dealingitem'};
            me.execCommand('go', data);
        });

        me.topTool.find('#share').bind('click', function (e) {

        });
    }


    function InitBody(el, p1) {
        el.empty();
        el.load("plugins/todopackage/html/itemMz.html", function (e) {
            el.find("#signature").jSignature();
            loadPage(el, p1);
            el.find('#reset').bind('click', el, function () {
                el.find("#signature").jSignature("reset");
            });
            $(this).find('a').bind('click', el, function () {
                var number = el.find('#id').text();
                var qianming = '';
                var datapair = el.find('#signature').jSignature("getData", "image"); //设置输出的格式，具体可以参考官方文档
                var check = el.find('#signature').jSignature('getData', 'native').length;
                if (check > 0) {
                    var i = new Image();
                    i.src = "data:" + datapair[0] + "," + datapair[1];
                    qianming = i.src;
                }

                switch (this.id) {
                    case "tohome":
                        var data = {icon: 'icon-globe', title: '首页', a: 'home', b: 'index'};
                        me.execCommand('go', data);
                        break;
                    case "solve":

                        var solveurl = me.rootPath + 'zq_todo/saveSig.do';

                        if (qianming.length > 0) {

                            var ps = {
                                number: iwfTool.encryptByDES(number),
                                signature: i.src,
                                accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
                                key: me.options.token.key
                            }
                            $.post(solveurl, ps, function (json, scope) {
                                if (json.success) {
                                    qiao.bs.msg({
                                        msg: json.msg,
                                        type: 'success'
                                    });
                                } else {
                                    qiao.bs.msg({
                                        msg: json.msg,
                                        type: 'danger'
                                    });
                                }
                            }, 'json');
                        } else {
                            qiao.bs.msg({
                                msg: '请签名!',
                                type: 'info'
                            });
                        }
                        break;
                }
            });
        })
    }

    //上传用户位置的方法
    function quitUpPosition() {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var marker = new BMap.Marker(r.point);
                var hisUrl = me.rootPath + 'mz_gps/saveHis.do';
                var todoUrl = me.rootPath + 'mz_gps/saveTodo.do';
                var eventNum = me.bodyRoot.find('#eventNumber').text();
                var params = {
                    username: me.options.userInfo.name,
                    lngLat: r.point.lng + "," + r.point.lat,
                    cssStatus: "03",
                    eventNum: eventNum,
                    mapType: "接受操作-测试"
                }
                $.post(hisUrl, params, function (data, status) {
                    alert(data + "   11");
                    var json = JSON.parse(data);
                    if (!json.success) {
                        clearInterval(intervalId);
                    }
                });
                $.post(todoUrl, params, function (data, status) {
                    alert(data + "   22");
                    var json = JSON.parse(data);
                    if (!json.success) {
                        clearInterval(intervalId);
                    }
                });
            }
        }, {enableHighAccuracy: true})
    }

    function loadPage(el, p1) {
        var usernameId = userName;
        var ps = {
            number: iwfTool.encryptByDES(p1),
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }
        $.post(me.rootPath + 'zq_todo/getOcml.do', ps, function (json, scope) {
            if (json.success) {
                var data = json.obj[0];
                if (data != '') {

                    el.find('#id').text(data.number);
                    el.find('#type').text(data.category);
                    el.find('#jiaofu').text(data.cssContact);
                    el.find('#peizhi').text(data.logicalName);
                    var signature = data.signature;
                    if (signature != '') {
                        el.find('#signature').jSignature("setData", signature);
                    }

                }

            } else {
                qiao.bs.msg({
                    msg: json.msg,
                    type: 'danger'
                });
            }
        }, 'json');
    }


    function flash(root, p1) {
        me.root = root.c;
        root.c.children().remove();// me.options.userInfo.autoid,
        me.topRoot = $('<div></div>').appendTo(me.root);
        me.bodyRoot = $('<div></div>').appendTo(me.root);
        InitUI(me.topRoot);
        InitBody(me.bodyRoot, p1);

    }

    me.addListener('do', function (key, args) {
        if (args.b == "itemMz") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            var p1 = args.params.number;
            flash(tab, p1);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}