IWF.plugins['doingcase'] = function () {

    var me = this;
    var nav = {icon: 'icon-briefcase', title: '我的待办', a: 'doingcase', b: 'doingcase', index: 2, canClose: true};
    var userName = me.options.userInfo.name;//me.options.userInfo.name
    var url = me.rootPath;

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
        var data = {icon: 'icon-globe', color: 'icon-blue', title: '首页', a: 'home', b: 'index'};
        me.execCommand('go', data);
    }

    function SendCase(item) {
        var ps = {
            flowid: item.flowid,
            pactid: item.caseid,
            nactid: 'A001',
            roleids: '',
            userids: '13,14,15',
            deptids: ''
        }
        $.getJSON("/ServiceFramework/case/sendCase.data?", ps, function (js) {
            if (js.success) {
                LoadDoingCase('');
            }
        });
    }

    function LinkCaseItem(sender) {
        var This = sender.data;
        var data = {
            flowid: This.flowid,
            caseid: This.case_id,
            actid: This.actid,
            Name: This.casecnname,
            bactid: This.id
        };
        me.execCommand('go', {
            a: 'showcase',
            b: sender.data.caseid,
            title: sender.data.wcase.cnname,
            index: 5,
            params: data
        });
    }

    function CaseDetail(item) {
        if (item.cssAcceptFlag != 'true') {
            var data = {icon: 'icon-globe', color: 'icon-blue', title: '首页', a: 'caseinfo', b: 'caseinfo', index: 2};
            data.params = {number: item.number, cssAcceptFlag: item.cssAcceptFlag};
            me.execCommand('go', data);
        } else {
            var data = {icon: 'icon-globe', color: 'icon-blue', title: '首页', a: 'recicase', b: 'recicase', index: 2};
            data.params = {number: item.number, cssAcceptFlag: item.cssAcceptFlag};
            me.execCommand('go', data);
        }


    }

    var ps = {
        index: 1,
        size: 20,
        keyword: '',
        status: 0,
        fromdate: '',
        todate: '',
        caseid: 12,
        userid: me.options.userInfo.id,
        queryType: 'OnlyMainUser'
    }
    var pageConfig = {
        total: 0, pageSize: 20, pageCount: 0, pageIndex: 1, pageclick: function (pageIndex, pageSize) {
            ps.index = pageIndex;
            ps.size = pageSize;
            LoadDoingCase('');
        }
    }


    function InitUI(el) {
        el.empty();
        var tplBack = '<div class="header" style="z-index:300;"> <a href="javascript:void(0);" class="back"></a> 待办事项 </div> ';
        me.topTool = $(tplBack).appendTo(el);
        me.topTool.find('a:eq(0)').bind('click', caseConfig.back);
    }

    var getfenpai = function () {
        return function (el) {
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
                    el.find('#assign').bind('click', function (e) {
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '处理列表',
                            a: 'dealing',
                            b: 'dealing',
                            params: {status: '01', total: el.find('#fenpai').text()}
                        };
                        me.execCommand('go', data);
                    });
                    el.find('#dealing').bind('click', function (e) {
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '处理列表',
                            a: 'dealing',
                            b: 'dealing',
                            params: {status: '02', total: el.find('#chuli').text()}
                        };
                        me.execCommand('go', data);
                    });
                    el.find('#hangup').bind('click', function (e) {
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '处理列表',
                            a: 'dealing',
                            b: 'dealing',
                            params: {status: '03', total: el.find('#guaqi').text()}
                        };
                        me.execCommand('go', data);
                    });
                } else {
                    el.find('#fenpai').html('0');
                    el.find('#guaqi').html('0');
                    el.find('#chuli').html('0');

                    el.find('#assign').bind('click', function (e) {
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '处理列表',
                            a: 'dealing',
                            b: 'dealing',
                            params: {status: '01', total: el.find('#fenpai').text()}
                        };
                        me.execCommand('go', data);
                    });
                    el.find('#dealing').bind('click', function (e) {
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '处理列表',
                            a: 'dealing',
                            b: 'dealing',
                            params: {status: '02', total: el.find('#chuli').text()}
                        };
                        me.execCommand('go', data);
                    });
                    el.find('#hangup').bind('click', function (e) {
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '处理列表',
                            a: 'dealing',
                            b: 'dealing',
                            params: {status: '03', total: el.find('#guaqi').text()}
                        };
                        me.execCommand('go', data);
                    });
                }
            });
        }
    }

    function getRequest(el) {
        $.getJSON(me.rootPath + 'zq_todo/ocmqlist.do', {
            usernameId: iwfTool.encryptByDES(userName),
            size: 5,
            index: 1,
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }, function (json, scope) {
            if (json.success) {
                var data = json.obj[0];

                el.find('#request').html(data.total);


                el.find('#qingqiu').bind('click', function (e) {
                    var data = {
                        icon: 'icon-globe',
                        color: 'icon-blue',
                        title: '请求列表',
                        a: 'dealingreq',
                        b: 'dealingreq',
                        params: {total: el.find('#request').text()}
                    };
                    me.execCommand('go', data);
                });

            } else {
                qiao.bs.msg({
                    msg: json.msg,
                    type: 'danger'
                });
            }
        });
    }

    function InitBody(el) {
        el.empty();
        el.load("plugins/todopackage/html/toDo.html", function (e) {
            var op = getfenpai();
            op(el);
            getRequest(el);
            var cont = el.find('.container')[0];
            dropRefresh({
                el: cont,
                next: function (e) {
                    //松手之后执行逻辑,ajax请求数据，数据返回后隐藏加载中提示
                    var that = this;
                    that.back.call();
                },
                initEl: el,
                refresh: getfenpai()//刷新列表方法
            });

        })
    }


    function flash(root) {
        me.root = root.c;
        root.c.children().remove();// me.options.userInfo.autoid,
        me.topRoot = $('<div></div>').appendTo(me.root);
        me.bodyRoot = $('<div></div>').appendTo(me.root);
        InitUI(me.topRoot);
        InitBody(me.bodyRoot);
        //me.topRoot.height(15);
        // me.searchbox.width(150);
        // LoadDoingCase(1,12);

    }

    me.addListener('do', function (key, args) {
        if (args.b == "doingcase") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(tab);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}