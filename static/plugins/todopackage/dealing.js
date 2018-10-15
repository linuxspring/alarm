IWF.plugins['dealing'] = function () {

    var me = this;
    var nav = {icon: 'icon-briefcase', title: '处理列表', a: 'dealing', b: 'dealing', index: 2, canClose: true};
    var userName = me.options.userInfo.name;// me.options.userInfo.name
    var url = me.rootPath + 'zq_todo/prob.do';

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

    function DelBact(item) {
        var tpl = '<h4>你确定要删除[' + item.casecnname + ']吗?</h4>';

        me.root.Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    var ps = {userid: me.options.userInfo.id, caseid: item.caseid, bactids: item.id, type: 0}
                    $.getJSON("/ServiceFramework/case/DelBact.data?", ps, function (js) {
                        if (js.success) {
                            LoadDoingCase('');
                        } else
                            $.fn.alert({success: true, msg: js.msg});
                    });
                }
            }
        });
    }

    function SendBack(item) {
        var data = {icon: 'icon-globe', title: '我的待办', a: 'doingcase', b: 'doingcase'};
        me.execCommand('go', data);
    }


    function InitUI(el) {
        el.empty();
        var tplBack = '<div></div> ';
        me.topTool = $(tplBack).appendTo(el);
    }

    function InitBody(el, status) {
        el.empty();
        el.load("plugins/todopackage/html/dealing.html", function (e) {
            $.getJSON(me.rootPath + 'zq_todo/sumprob.do', {
                usernameId: iwfTool.encryptByDES(userName),
                accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
                key: me.options.token.key
            }, function (json, scope) {
                if (json.success) {
                    var data = json.obj;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].status.indexOf('分派') != -1) {
                            el.find('#fenpai').html(json.obj[i].count);
                        }
                        if (data[i].status.indexOf('处理') != -1) {

                            el.find('#chuli').html(json.obj[i].count);
                        }
                        if (data[i].status.indexOf('挂起') != -1) {
                            el.find('#guaqi').html(json.obj[i].count);
                        }
                    }
                }
            });

            var total = 0;
            if (status == '01') {
                total = Number(el.find('#fenpai').text());
            }
            if (status == '02') {

                total = Number(el.find('#chuli').text());
            }
            if (status == '03') {
                total = Number(el.find('#guaqi').text());
            }

            loadInfo(el, status, total);
            el.find('.back').bind('click', function (e) {
                var data = {title: '我的待办', a: 'doingcase', b: 'doingcase'};
                me.execCommand('go', data);
            });


        })
    }

    function loadInfo(el, status, total) {


        $.getJSON(url, {
            usernameId: iwfTool.encryptByDES(userName),
            status: status,
            pageSize: total,
            pageIndex: 1,
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }, function (json, scope) {
            var data = json.obj[0].rows;
            if (data.length > 0) {

                var content = el.find('#content');
                content.empty();
                for (var i = 0; i < data.length; i++) {
                    content.append('<a href="javascript:void(0);" class="item" >' +
                        '<span class="rjt"></span>' +
                        ' <div class="title ">' + data[i].number + '</div>' +
                        ' <div class="info">' +
                        '<span class="st">工单状态 : ' + data[i].cssStatus + '</span>' +
                        '<span class="st">接受状态 : ' + turn(data[i].cssAcceptFlag) + '</span>' +
                        '<span class="st lc">紧急状态 : ' + data[i].severity + '</span>' +
                        '</div>' +
                        ' <div class="time">发布时间 : ' + data[i].openTime + '</div>' +
                        ' <p  id="' + i + '" style="display: none;">' + data[i].number + '</p></a>');

                    if ((i + 1) == 10) {
                        content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">1~10条</div>');
                    }
                    if ((i + 1) % 10 == 0 && (i + 1) > 10) {
                        content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">' + Number(i - 9) + '~' + Number(i + 1) + '条</div>');
                    }

                    //事件单根据不同状态跳转到不同页面
                    content.find('a:eq(' + i + ')').bind('click', el, function (e) {
                        var status = el.find('#status').text();
                        var a = $(this).find('p').text();
                        if (status == '挂起中') {

                            var data = {
                                icon: 'icon-globe',
                                title: '事件单解挂',
                                a: 'jiegua',
                                b: 'jiegua',
                                index: 2,
                                params: {number: a}
                            };
                            me.execCommand('go', data);
                        }
                        else if (status == '已分派') {

                            var data = {
                                icon: 'icon-globe',
                                title: '事件单接受',
                                a: 'caseinfo',
                                b: 'caseinfo',
                                index: 2,
                                params: {number: a}
                            };
                            me.execCommand('go', data);
                        }
                        else {
                            if (me.options.userInfo.cityCode == '031200') {
                                var data = {
                                    icon: 'icon-globe',
                                    color: 'icon-blue',
                                    title: '事件单',
                                    a: 'recicase',
                                    b: 'recicase',
                                    params: {number: a}
                                };
                                me.execCommand('go', data);
                            } else if (me.options.userInfo.cityCode == '031400') {
                                var data = {
                                    icon: 'icon-globe',
                                    color: 'icon-blue',
                                    title: '事件单',
                                    a: 'recicase_mz',
                                    b: 'recicase_mz',
                                    params: {number: a}
                                };
                                me.execCommand('go', data);
                            }

                        }
                    });
                }

                if (status == '01') {

                    el.find('#hd').text('已分派');
                    el.find('#status').text('已分派');
                }
                if (status == '02') {

                    el.find('#hd').text('处理中');
                    el.find('#status').text('处理中');
                }
                if (status == '03') {
                    el.find('#hd').text('挂起中');
                    el.find('#status').text('挂起中');
                }


                el.find('#accept').text(turn(data[0].cssAcceptFlag));
                el.find('#mergency').text(data[0].severity);
            } else {
                if (status == '01') {

                    el.find('#hd').text('已分派');
                    el.find('#status').text('已分派');
                }
                if (status == '02') {

                    el.find('#hd').text('处理中');
                    el.find('#status').text('处理中');
                }
                if (status == '03') {
                    el.find('#hd').text('挂起中');
                    el.find('#status').text('挂起中');
                }
                el.find('#content').append('<div style="text-align: center;">无数据记录</div>');
                el.find('#accept').text('未接受');
                el.find('#mergency').text('低');
            }

        });
    }


    function turn(a) {
        var b = '';
        if (a == 'true') {
            b = '已接受';
        } else {
            b = '未接受';
        }
        return b;
    }

    function flash(root, status) {
        me.root = root.c;
        root.c.children().remove();// me.options.userInfo.autoid,
        me.topRoot = $('<div></div>').appendTo(me.root);
        me.bodyRoot = $('<div></div>').appendTo(me.root);
        InitUI(me.topRoot);
        InitBody(me.bodyRoot, status);
        //me.topRoot.height(15);
        // me.searchbox.width(150);
        // LoadDoingCase(1,12);

    }

    me.addListener('do', function (key, args) {
        if (args.b == "dealing") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            var status = args.params.status;
            flash(tab, status);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}