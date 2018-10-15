IWF.plugins['casedetail'] = function () {

    var me = this;
    var nav = {icon: 'icon-briefcase', title: '事件单详情', a: 'casedetail', b: 'casedetail', index: 2, canClose: true};
    var url = me.rootPath + 'zq_todo/probOne.do';
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
        var data = {icon: 'icon-globe', title: '事件单', a: 'recicase', b: 'recicase'};
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

        }
    }


    function InitUI(el) {
        el.empty();
        var tplBack = '<div></div> ';
        me.topTool = $(tplBack).appendTo(el);
    }

    function InitBody(el, number) {
        el.empty();
        el.load("plugins/todopackage/html/eventDetail.html", function (e) {
            loadPage(el, number);
            el.find('#fanhui').bind('click', el, function () {
                var a = el.find('#number').text();
                var data = {icon: 'icon-globe', title: '事件单', a: 'recicase', b: 'recicase', params: {number: a}};
                me.execCommand('go', data);
            });
        })
    }

    function loadPage(el, number) {
        var ps = {
            number: iwfTool.encryptByDES(number),
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }
        $.getJSON(url, ps, function (json, scope) {
            if (json.success) {
                var data = json.obj[0].prob;
                var configInfo = json.obj[0].deviceDetail;
                var userInfo = json.obj[0].contact[0];
                if (data != undefined) {
                    el.find('#title').text(data.title);
                    el.find('#openedBy').text(data.openedBy);
                    el.find('#number').text(data.number);
                    el.find('#location').text(data.locationFullName);
                    el.find('#enmergency').text(data.severity);
                    el.find('#fenlei').text(data.category);
                    el.find('#describe').text(data.action);
                }
                //配置项信息
                if (configInfo != undefined) {
                    el.find('#name').text(configInfo.ciName);
                    el.find('#ip').text(configInfo.ipAddress);
                    el.find('#place').text(configInfo.building);
                    el.find('#configNumber').text(configInfo.logicalName);
                    el.find('#kind').text(configInfo.type);
                    el.find('#children').text(configInfo.subtype);
                    el.find('#xulie').text(configInfo.assetTag);
                    el.find('#configDept').text(configInfo.folder);
                    el.find('#guishuDept').text(configInfo.cssDept);
                    el.find('#contact').text(configInfo.firstName);
                }
                if (userInfo != undefined) {
                    el.find('#phone').text(userInfo.portablePhone);
                    el.find('#dept').text(userInfo.corpStructure);
                }

            } else {
                qiao.bs.msg({
                    msg: json.msg,
                    type: 'danger'
                });
            }
        });
    }

    function flash(root, number) {
        me.root = root.c;
        root.c.children().remove();// me.options.userInfo.autoid,
        me.topRoot = $('<div></div>').appendTo(me.root);
        me.bodyRoot = $('<div></div>').appendTo(me.root);
        InitUI(me.topRoot);
        InitBody(me.bodyRoot, number);
        //me.topRoot.height(15);
        // me.searchbox.width(150);
        // LoadDoingCase(1,12);

    }

    me.addListener('do', function (key, args) {
        if (args.b == "casedetail") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            var number = args.params.number;
            flash(tab, number);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}