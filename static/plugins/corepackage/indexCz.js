IWF.plugins['index'] = function () {

    var me = this;

    me.ruleTree = [];
    var nav = {icon: 'icon-globe', color: 'icon-blue', title: '首页', a: 'home', b: 'index'};

    var navLeft = [
        {icon: 'icon-leaf', color: 'icon-red', title: '我的测试', a: 'llx', b: 'test'}
        , {icon: 'icon-comments', color: 'icon-blue', title: '我的测试', a: 'llx', b: 'test1'}
        , {icon: 'icon-globe', color: 'icon-yellow', title: '我的测试', a: 'llx', b: 'test2'}
        , {icon: 'icon-group', color: 'icon-green', title: '我的测试', a: 'llx', b: 'test3'}
        , {icon: 'icon-coffee', color: 'icon-blue', title: '我的测试', a: 'llx', b: 'test4'}
        , {icon: 'icon-heart', color: 'icon-red', title: '我的测试', a: 'llx', b: 'test5'}
    ];

    var topRoot, mainRoot, bottomRoot, bodyRoot;

    me.addListener('init', function () {
        me.execCommand('addtab', nav);
    });

    me.addListener('initurl', function () {
        me.execCommand('go', nav);
    });
    function init() {
        nav.key = nav.a;
        if (me.execCommand('rules', nav)) {
            me.execCommand('addnav', nav);
        }
    }

    function logout() {
        var tpl = '<h4>你确定要退出系统吗?</h4>';
        var el = $('body');
        el.Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON('pageLogout.action', function (json) {
                        if (json.succ) {
                            window.location.href = "../../index.html";
                        } else {
                            IWF.alert({succ: false, msg: json.msg});
                        }

                    });

                }
            }
        });
    }


    function logout2() {
        var tpl = '<div class="modal fade"  tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
            + '<h4 class="modal-title">{title}</h4></div><div class="modal-body">{content}</div><div class="modal-footer">'
            + '<button type="submit" id="btnYes" class="btn btn-primary">确定</button>'
            + '<a type="button" id="btnNo" class="btn btn-default" data-dismiss="modal">取消</a>'
            + '</div></div></div></div>';
        var options = {title: '提示', content: "您确定要退出系统吗？"}
        var This = $(utils.replaceTpl(tpl, options)).appendTo($('body'));

        function CloseWin(sender) {
            This.remove();
        }

        This.find('#btnYes').bind('click', {ok: true}, CloseWin);
        This.find('#btnNo').bind('click', {ok: false}, CloseWin);
        This.find('.close').bind('click', {ok: false}, CloseWin);
        This.body = This.find('.modal-body').css('padding-top', 0);
        This.modal('show');

    }

    function setChildWindow(args, root) {
        var temp = root.find('#' + args.b);
        if (temp.length == 0) {
            temp = $('<div id="' + args.b + '"></div>').appendTo(root);
        }
        temp.show();
        temp.siblings().hide();
        //me.fireEvent(args.b, temp);
    }

    function appclick(e) {
        var aEl = $(this);
        switch (this.id) {
            case "case_doing":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '首页',
                    a: 'doingcase',
                    b: 'doingcase',
                    index: 2
                };
                me.execCommand('go', data);

                break;
            case "personal":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '我的',
                    a: 'user',
                    b: 'user',
                    index: 3
                };

                data.params = {key: 'setting', value: '2017'}
                me.execCommand('go', data);
                break;
            case 'confmgr':
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '配置项',
                    a: 'newconfig',
                    b: 'newconfig',
                    index: 4
                };
                me.execCommand('go', data);

                break;

            case "userecord":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '领用单',
                    a: 'useRecordList',
                    b: 'useRecordList',
                    index: 6
                };
                me.execCommand('go', data);
                break;

            case "tab1":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '台风状况',
                    a: 'taifeng',
                    b: 'taifeng',
                    index: 6
                };
                me.execCommand('go', data);
                break;
            case 'tab3':
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '电网运行',
                    a: 'dianwang',
                    b: 'dianwang',
                    index: 4
                };
                me.execCommand('go', data);
                break;
            case "tab5":
                var data = {icon: 'icon-globe', color: 'icon-blue', title: '我的', a: 'user', b: 'user', index: 3};
                me.execCommand('go', data);
                break;
            case "request":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '我的',
                    a: 'requestDetail',
                    b: 'requestDetail',
                    index: 3
                };
                me.execCommand('go', data);
                break;
            case "change":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '我的',
                    a: 'changeDetail',
                    b: 'changeDetail',
                    index: 3
                };
                me.execCommand('go', data);
                break;
            case "test":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '',
                    a: 'requestDetail',
                    b: 'requestDetail',
                    index: 3
                };
                me.execCommand('go', data);
                break;
            case "aa":
                var data = {
                    icon: 'icon-globe',
                    color: 'icon-blue',
                    title: '',
                    a: 'resultPage',
                    b: 'resultPage',
                    index: 3
                };
                me.execCommand('go', data);
                break;
        }
    }


    function InitRowUI(el) {
        el.empty();
        el.load("plugins/newpackage/html/indexCz.html", function (e) {

            $(this).find('a').bind('click', appclick);

            // 引入尾部
            // $(this).find('#footer').load("plugins/public/footer.html");

        })
    }

    function flash(args, tab) {
        if (tab.c.children().length == 0) {
            bodyRoot = tab.c;
            var temp = $('<div></div>').appendTo(tab.c);
            //topRoot = $('<div class="col-md-2"></div>').appendTo(temp);
            //mainRoot = $('<div class="col-md-8"></div>').appendTo(temp);
            //  mainRoot.css('border-left', "solid 1px #DDD").css('border-right', "solid 1px #DDD");
            //bottomRoot = $('<div class="col-md-2"></div>').appendTo(temp);
            //LoadLeftList();
            //InitUI(rightRoot);
            //createWeiXin(lastRoot);
            InitRowUI(temp);
        }
        me.execCommand('show', {a: args.a});
    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(args, tab);

            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });


};
