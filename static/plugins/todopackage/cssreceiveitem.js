IWF.plugins['cssreceiveitem'] = function () {

    var me = this;
    var nav = {
        icon: 'icon-briefcase',
        title: '领用单列表',
        a: 'cssreceiveitem',
        b: 'cssreceiveitem',
        index: 2,
        canClose: true
    };
    var userName = me.options.userInfo.name;// me.options.userInfo.name
    var url = me.rootPath + 'mz_inspect/cssreceive.do';

    me.addListener('init', function () {
        me.execCommand('addnav', nav);
        me.execCommand('addtab', nav);
    });


    var tplTextPnl = '<div class="panel panel-default {cls} in">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title"><span class="badge" style="background-color: #dddddd;">{count}</span>  <a href="javascript:void(0)" class="btn-link"><strong>{number}</strong></a></h3>' +
        '</div><div class="panel-body"></div></div>';
    var tplTitle = '<a class="btn btn-link"><h4 class="list-group-item-heading">{number}</h4></a>';
    //var tplTextPnl='<div class="panel panel-default"><div class="panel-body"></div></div>';
    var tplContext = '<div class="row"><div class="col-sm-4">发生时间：{openTime}</div><div class="col-sm-4">工单状态：{css_status}</div><div class="col-sm-4">紧急程度：{level}</div> <div class="col-sm-4">接受状态：{cssAcceptFlagTitle}</div></div>';
    var tplFoot = '<div href="javascript:void(0)"> <h5>{author} 发布于 {createtime} <strong>查看全文</strong></h5></div>';

    var tplCount = '<div class="panel panel-info"><div class="panel-heading"><i class="glyphicon glyphicon-circle-arrow-up"></i><a href=".{cls}" data-toggle="collapse" data-parent="#accordion" style="font-size: 15px;" class="btn-link"><span style="color:#353535;"> {title}</span>目前共有<span>{total}</span>条记录</a></div></div>';


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
        var data = {icon: 'icon-globe', title: '我的待办', a: 'requestUnitMz', b: 'requestUnitMz'};
        me.execCommand('go', data);
    }


    function InitUI(el) {
        el.empty();
        var tplBack = '<div></div> ';
        me.topTool = $(tplBack).appendTo(el);
    }

    function InitBody(el, args) {
        el.empty();
        el.load("plugins/todopackage/html/cssreceiveitem.html", function (e) {

            requestInfo(el, args);
            el.find('.back').bind('click', function (e) {
                var data = "";

                data = {icon: 'icon-globe', title: '我的待办', a: 'configRoomDetailMz', b: 'configRoomDetailMz'};

                //  var data = {title: '我的待办', a: 'requestUnitMz', b: 'requestUnitMz'};
                me.execCommand('go', data);
            });


        })
    }

    function requestInfo(el, args) {
        $.getJSON(me.rootPath + 'mz_inspect/cssreceive.do', {
            configId: iwfTool.encryptByDES(args.params.configId),
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }, function (json, scope) {
            if (json.success) {
                var data = json.obj;
                //var item=data.ocmlm1;
                var item = data;
                if (item != null) {
                    if (item.length > 0) {
                        var content = el.find('#content');
                        content.empty();
                        for (var i = 0; i < item.length; i++) {
                            content.append('<a class="item" >' +

                                ' <div class="title ">领用单ID : ' + item[i].id + '</div>' +
                                ' <div class="info">' +
                                '<span class="st">部件描述： : ' + item[i].cssDesc + '</span>' +
                                '<span class="st">领用时间 : ' + item[i].cssTime + '</span>' +
                                '</div>' +
                                ' <div class="time">领用人: ' + item[i].cssContactName + '</div>' +

                                '</a>');

                            if ((i + 1) == 10) {
                                content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">1~10条</div>');
                            }
                            if ((i + 1) % 10 == 0 && (i + 1) > 10) {
                                content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">' + Number(i - 9) + '~' + Number(i + 1) + '条</div>');
                            }


                        }

                    } else {
                        el.find('#content').append('<div style="text-align: center;">无数据记录</div>');
                    }
                } else {
                    el.find('#content').append('<div style="text-align: center;">无数据记录</div>');
                }
            } else {
                qiao.bs.msg({
                    msg: json.msg,
                    type: 'danger'
                });
            }
        });
    }

    function flash(root, args) {
        me.root = root.c;
        root.c.children().remove();// me.options.userInfo.autoid,
        me.topRoot = $('<div></div>').appendTo(me.root);
        me.bodyRoot = $('<div></div>').appendTo(me.root);
        InitUI(me.topRoot);
        InitBody(me.bodyRoot, args);
        //me.topRoot.height(15);
        // me.searchbox.width(150);
        // LoadDoingCase(1,12);

    }

    me.addListener('do', function (key, args) {
        if (args.b == "cssreceiveitem") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(tab, args);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}