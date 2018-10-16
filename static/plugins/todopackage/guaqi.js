IWF.plugins['guaqi'] = function () {

    var me = this;
    var nav = {icon: 'icon-briefcase', title: '事件单挂起', a: 'guaqi', b: 'guaqi', index: 2, canClose: true};
    var userName = me.options.userInfo.name;// me.options.userInfo.name
    var url = me.rootPath + 'zq_todo/hand/handUp.do';

    me.addListener('init', function () {
        me.execCommand('addnav', nav);
        me.execCommand('addtab', nav);
    });


    function InitUI(el) {
        el.empty();
        var tplBack = '<div></div> ';
        me.topTool = $(tplBack).appendTo(el);
        //me.topTool.find('a').bind('click', caseConfig.back);
    }

    function InitBody(el, p1) {
        el.empty();
        el.load("plugins/todopackage/html/guaqi.html", function (e) {

            loadPage(el, p1);
            el.find('.back').bind('click', el, function (e) {
                var a = el.find('#eventNumber').text();
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '事件单详情',
                    a: 'recicase',
                    b: 'recicase',
                    index: 3,
                    params: {number: a}
                };
                me.execCommand('go', data);
            });

            el.find('#hangup').bind('click', el, function (e) {

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
                            msg: '挂起理由字数过多!',
                            type: 'info'
                        });
                    }
                } else {
                    qiao.bs.msg({
                        msg: '挂起理由不能为空!',
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
        if (args.b == "guaqi") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            var p1 = args.params.number;
            flash(tab, p1);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}