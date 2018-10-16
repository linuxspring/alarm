IWF.plugins['dealingreq'] = function () {

    var me = this;
    var nav = {icon: 'icon-briefcase', title: '处理列表', a: 'dealingreq', b: 'dealingreq', index: 2, canClose: true};
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


    var toutouHtml = '<a href="javascript:void(0);" class="dudu" id="requestedDateSort">' +
        '<span>&nbsp;提交日期</span><img src="./images/downr.png" alt="" class="tuPian"></a>' +
        '<a href="javascript:void(0);" class="dudu" id="prioritySort">' +
        '<span>&nbsp;低</span><img src="./images/downr.png" alt="" class="tuPian">' + '</a>';

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

    function InitBody(el, args) {
        el.empty();
        el.load("plugins/todopackage/html/dealingreq.html", function (e) {

            requestInfo(el, args.params.total);
            el.find('.back').bind('click', function (e) {
                var data = {title: '我的待办', a: 'doingcase', b: 'doingcase'};
                me.execCommand('go', data);
            });


        })
    }

    var requestedDateSort = false;  //true升序，false降序
    var prioritySort = true;

    function requestInfoMZ(el, total) {


        $.getJSON(me.rootPath + 'sg_todo/ocmqlist.do', {
            usernameId: iwfTool.encryptByDES(userName),
            size: total,
            index: 1,
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key,
            prioritySort: prioritySort,
            requestedDateSort: requestedDateSort
        }, function (json) {
            if (json.success) {
                var data = json.obj[0].rows;

                if (data.length > 0) {
                    var content = el.find('#content');
                    content.empty();
                    for (var i = 0; i < data.length; i++) {
                        content.append('<a href="javascript:void(0);" class="item" id="' + data[i].number + '" style="height:3rem">' +
                            '<span class="rjt"></span>' +
                            ' <div class="title ">请求单号 : ' + data[i].number + '</div>' +
                            ' <div class="info">' +
                            '<span class="st">标题 : ' + data[i].briefDescription + '</span>' +
                            '</div>' +
                            ' <div class="info">' +
                            '<span class="st">申请人 : ' + data[i].requestorFname + '</span>' +
                            '<span class="st">提交人 : ' + data[i].requestorName + '</span>' +
                            '</div>' +
                            ' <div class="time">提交日期 : ' + data[i].requestedDate + '</div>' +
                            ' <p  id="' + i + '" style="display: none;">' + data[i].number + '</p></a>');

                        if ((i + 1) == 10) {
                            content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">1~10条</div>');
                        }
                        if ((i + 1) % 10 == 0 && (i + 1) > 10) {
                            content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">' + Number(i - 9) + '~' + Number(i + 1) + '条</div>');
                        }

                        content.find('.item').on('click', function (e) {
                            var a = $(this).attr('id');

                            var data = {
                                icon: 'icon-globe',
                                title: '请求单详情',
                                a: 'requestUnitSg',
                                b: 'requestUnitSg',
                                index: 2,
                                params: {orderNo: a}
                            };
                            me.execCommand('go', data);

                        });

                    }

                } else {
                    el.find('#content').append('<div style="text-align: center;">无数据记录</div>');
                }
            }
        });
    }

    function requestInfo(el, total) {
        if (me.options.userInfo.cityCode == '030200') {
            var toutou = el.find(".toutou");
            toutou.css('display', '');
            toutou.html(toutouHtml);
            toutou.find('a').on('click', function () {

                var chickId = $(this).attr('id');
                if (chickId == "requestedDateSort") {
                    if (requestedDateSort == false) {
                        requestedDateSort = true;
                        $(this).find("img").css("transform", "rotateX(" + 180 + "deg" + ")");
                    } else {
                        requestedDateSort = false;
                        $(this).find("img").css("transform", "rotateX(" + 0 + "deg" + ")");
                    }
                } else {
                    if (prioritySort == false) {
                        prioritySort = true;
                        $(this).find("img").css("transform", "rotateX(" + 0 + "deg" + ")");
                    } else {
                        prioritySort = false;
                        $(this).find("img").css("transform", "rotateX(" + 180 + "deg" + ")");
                    }
                }
                el.find('#content').empty();
                requestInfoMZ(el, total);//重载方法，调用ajax刷新页面
            });

            requestInfoMZ(el, total);

        } else {

            $.getJSON(me.rootPath + 'zq_todo/ocmqlist.do', {
                usernameId: iwfTool.encryptByDES(userName),
                size: total,
                index: 1,
                accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
                key: me.options.token.key
            }, function (json, scope) {
                if (json.success) {
                    var data = json.obj[0].rows;

                    if (data.length > 0) {
                        var content = el.find('#content');
                        content.empty();
                        for (var i = 0; i < data.length; i++) {
                            content.append('<a href="javascript:void(0);" class="item" >' +
                                '<span class="rjt"></span>' +
                                ' <div class="title ">请求单号 : ' + data[i].number + '</div>' +
                                ' <div class="info">' +
                                '<span class="st">处于阶段 : ' + data[i].currentPhase + '</span>' +
                                '<span class="st">分配人 : ' + data[i].assignedTo + '</span>' +
                                '</div>' +
                                ' <div class="time">账 号 : ' + data[i].apprName + '</div>' +
                                ' <p  id="' + i + '" style="display: none;">' + data[i].number + '</p></a>');

                            if ((i + 1) == 10) {
                                content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">1~10条</div>');
                            }
                            if ((i + 1) % 10 == 0 && (i + 1) > 10) {
                                content.append('<div style="height: 15px;background: #F1F1F1;text-align: center;margin-top: 5px;">' + Number(i - 9) + '~' + Number(i + 1) + '条</div>');
                            }

                            content.find('a:eq(' + i + ')').bind('click', el, function (e) {
                                var a = $(this).find('p').text();
                                if (me.options.userInfo.cityCode == '031200') {
                                    var data = {
                                        icon: 'icon-globe',
                                        title: '请求单详情',
                                        a: 'requestDetail',
                                        b: 'requestDetail',
                                        index: 2,
                                        params: {orderNo: a}
                                    };
                                    me.execCommand('go', data);
                                } else if (me.options.userInfo.cityCode == '031400') {
                                    var data = {
                                        icon: 'icon-globe',
                                        title: '请求单详情',
                                        a: 'requestUnitMz',
                                        b: 'requestUnitMz',
                                        index: 2,
                                        params: {number: a}
                                    };
                                    me.execCommand('go', data);
                                }
                            });

                        }

                    } else {
                        el.find('#content').append('<div style="text-align: center;">无数据记录</div>');
                    }
                }
            });
        }
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
        if (args.b == "dealingreq") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(tab, args);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}