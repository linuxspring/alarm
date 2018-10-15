IWF.plugins['jiegua'] = function () {

    var me = this;
    var nav = {icon: 'icon-briefcase', title: '事件单解挂', a: 'jiegua', b: 'jiegua', index: 2, canClose: true};
    var userName = me.options.userInfo.name;//me.options.userInfo.name
    var url = me.rootPath + 'zq_todo/hand/handDown.do';//解卦服务路径

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
        //me.topTool.find('a').bind('click', caseConfig.back);
    }

    function InitBody(el, p1) {
        el.empty();
        el.load("plugins/todopackage/html/jiegua.html", function (e) {

            loadPage(el, p1);
            el.find('.back').bind('click', el, function (e) {

                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '事件单详情',
                    a: 'dealing',
                    b: 'dealing',
                    index: 3,
                    params: {status: '03'}
                };
                me.execCommand('go', data);
            });

            el.find('#jiegua').bind('click', el, function (e) {

                var a = el.find('#eventNumber').text();
                var b = el.find('#reason').val();
                if (b != '') {
                    if (b.length < 400) {

                        var ps = {
                            usernameid: iwfTool.encryptByDES(userName),
                            number: iwfTool.encryptByDES(a),
                            cssUpdateAction: b,
                            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
                            key: me.options.token.key
                        }
                        $.post(url, ps, function (json, scope) {
                            if (json.success == true) {
                                qiao.bs.msg({
                                    msg: json.msg,
                                    type: 'success'
                                });
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

                        }, 'json');
                    } else {
                        qiao.bs.msg({
                            msg: '解挂理由字数过多!',
                            type: 'info'
                        });
                    }
                } else {
                    qiao.bs.msg({
                        msg: '解挂理由不能为空!',
                        type: 'info'
                    });
                }

            });

        })
    }

    function loadPage(el, p1) {
        var loadurl = me.rootPath + 'zq_todo/probOne.do';
        var ps = {
            number: iwfTool.encryptByDES(p1),
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }
        $.getJSON(loadurl, ps, function (json, scope) {
            if (scope == 'success') {
                var data = json.obj[0].prob;
                var reporter = json.obj[0].contact[0].fullName;
                el.find('#title').text(data.title);
                el.find('#reporter').text(reporter);
                el.find('#eventNumber').text(data.number);
            } else {
                alert('没有数据！');
            }
        });


    }

    function flash(root, p1) {
        me.root = root.c;
        root.c.children().remove();// me.options.userInfo.autoid,
        me.topRoot = $('<div></div>').appendTo(me.root);
        me.bodyRoot = $('<div></div>').appendTo(me.root);
        InitUI(me.topRoot);
        InitBody(me.bodyRoot, p1);
        //me.topRoot.height(15);
        // me.searchbox.width(150);
        // LoadDoingCase(1,12);

    }

    me.addListener('do', function (key, args) {
        if (args.b == "jiegua") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            var p1 = args.params.number;
            flash(tab, p1);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}