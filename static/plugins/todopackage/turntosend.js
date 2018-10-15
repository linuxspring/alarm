IWF.plugins['turntosend'] = function () {

    var me = this;

    var nav = {icon: 'icon-briefcase', title: '事件单转派', a: 'turntosend', b: 'turntosend', index: 2, canClose: true};

    var userName = me.options.userInfo.name; //me.options.userInfo.fullName
    var saveTodoUrl = me.rootPath + 'mz_gps/saveTodo.do';
    var positionSwitch = me.options.userInfo.positionSwitch;

    var groupUrl = me.rootPath + 'zq_todo/assignment.do';//分配组服务路径
    var assignerUrl = me.rootPath + 'zq_todo/assignmentItem.do';//分配人服务路径
    var url = me.rootPath + 'zq_todo/probOne.do';//事件单详情服务路径
    var assignUrl = me.rootPath + 'zq_todo/send.do';//转派事件服务路径

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
        var data = {icon: 'icon-globe', title: '事件单', a: 'recicase', b: 'recicase'};
        me.execCommand('go', data);
    }


    function InitUI(el) {
        el.empty();
        var tplBack = '<div></div> ';
        me.topTool = $(tplBack).appendTo(el);
    }

    function InitBody(el, p1, status) {
        el.empty();
        el.load("plugins/todopackage/html/eventSend.html", function (e) {

            loadPage(el, p1);
            el.find('#back').bind('click', el, function () {
                var a = el.find('#eventNumber').text();
                if (status == '01') {

                    var data = {icon: 'icon-globe', title: '接受/转派', a: 'caseinfo', b: 'caseinfo', params: {number: a}};
                    me.execCommand('go', data);
                } else {
                    var data = {icon: 'icon-globe', title: '事件单', a: 'recicase', b: 'recicase', params: {number: a}};
                    me.execCommand('go', data);
                }
            });
            //onchange事件 加载分配人
            el.find('#group').change(el, function () {

                var group = el.find('#group').val();
                getAssigner(el, group);
            });
            //转派
            el.find('#send').bind('click', el, function () {
                var advice = el.find('#advice').val()
                if (advice != '') {
                    var name1 = me.options.userInfo.fullName;
                    var name2 = el.find('#assigner').find("option:selected").text();
                    if (name1 != name2) {

                        if (advice.length < 400) {
                            var ps = {
                                number: iwfTool.encryptByDES(el.find('#eventNumber').text()),
                                usernameId: iwfTool.encryptByDES(userName),
                                userName: el.find('#assigner').val(),
                                assignmentGroup: el.find('#group').val(),
                                fullName: el.find('#assigner').find("option:selected").text(), //me.options.userInfo.fullName
                                cssNoto: '',
                                cssUpdateAction: advice,
                                accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
                                key: me.options.token.key
                            }
                            $.post(assignUrl, ps, function (json, scope) {
                                if (json.success) {
                                    qiao.bs.msg({
                                        msg: json.msg,
                                        type: 'success'
                                    });

                                    /*-----------------------梅州地图位置上传相关--分割线开始--------------------------------------------*/
                                    if (positionSwitch.indexOf("true") != -1) {
                                        //转派工单时的位置处理
                                        var eventNum = el.find('#eventNumber').text();
                                        upUserPositionForSend(userName, eventNum, me.options.token.key, me.options.token.accessToken);

                                    }
                                    /*-----------------------梅州地图位置上传相关--分割线结束--------------------------------------------*/

                                    var data = {
                                        icon: 'icon-globe',
                                        color: 'icon-blue',
                                        title: '待办',
                                        a: 'doingcase',
                                        b: 'doingcase',
                                        index: 3
                                    };
                                    me.execCommand('go', data);


                                } else {
                                    qiao.bs.msg({
                                        msg: json.msg,
                                        type: 'danger'
                                    });
                                }
                            }, "json");
                        } else {
                            qiao.bs.msg({
                                msg: '处理意见字数过多!',
                                type: 'info'
                            });
                        }
                    } else {
                        qiao.bs.msg({
                            msg: '不能转派给自己!',
                            type: 'info'
                        });
                    }
                } else {
                    qiao.bs.msg({
                        msg: '处理意见不能为空!',
                        type: 'info'
                    });
                }
            });

        })
    }

    function loadPage(el, p1) {

        var ps = {
            number: iwfTool.encryptByDES(p1),
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }
        $.getJSON(url, ps, function (json, scope) {
            if (scope == 'success') {
                var data = json.obj[0].prob;
                el.find('#title').text(data.title);
                el.find('#reporter').text(data.openedBy);
                el.find('#eventNumber').text(data.number);
            }
        })

        $.getJSON(groupUrl, {
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }, function (json, scope) {
            if (json.success) {
                var data = json.obj;
                for (var i = 0; i < data.length; i++) {
                    el.find('#group').append('<option value="' + data[i].assignmetName + '">' + data[i].assignmetName + '</option>');
                }

                getAssigner(el, data[0].assignmetName);
            }
        });
    }

    //获取分配人
    function getAssigner(el, group) {
        var ps = {
            groupName: group,
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }
        $.post(assignerUrl, ps, function (json, scope) {
            if (json.success) {
                var data = json.obj;
                el.find('#assigner').empty();
                for (var i = 0; i < data.length; i++) {
                    el.find('#assigner').append('<option value="' + data[i].userName + '">' + data[i].fullName + '</option>');
                }
            }
        }, 'json');
    }

    function flash(root, p1, status) {
        me.root = root.c;
        root.c.children().remove();// me.options.userInfo.autoid,
        me.topRoot = $('<div></div>').appendTo(me.root);
        me.bodyRoot = $('<div></div>').appendTo(me.root);
        InitUI(me.topRoot);
        InitBody(me.bodyRoot, p1, status);
        //me.topRoot.height(15);
        // me.searchbox.width(150);
        // LoadDoingCase(1,12);

    }

    me.addListener('do', function (key, args) {
        if (args.b == "turntosend") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            var number = args.params.number;
            var status = args.params.status;
            flash(tab, number, status);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}