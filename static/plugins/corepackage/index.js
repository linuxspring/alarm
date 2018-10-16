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

    var leftRoot, rightRoot, barRoot;

    // me.addListener('init', function () {
    //     me.execCommand('addtab', nav);
    // });
    //
    // me.addListener('initurl', function () {
    //     me.execCommand('go', nav);
    // });
    // function init() {
    //     nav.key = nav.a;
    //     if (me.execCommand('rules', nav)) {
    //         me.execCommand('addnav', nav);
    //     }
    // }
    //
    // me.addListener('init', init);

    function itemClick(data) {
        var ps = {json: utils.fromJSON(data), userid: me.options.userInfo.id}
        $.post('/ServiceFramework/rule/savemodule.data', ps, function (js, scope) {
            me.execCommand('go', data);
        });

    }


    function LoadLeftList() {
        var ps = {key: '', userid: me.options.userInfo.id}
        $.getJSON('/ServiceFramework/rule/mlist.data', ps, function (js, scope) {
            leftRoot.listNav({
                data: js, click: function (data) {
                    itemClick(data);
                }
            });
        });
    }

    function ImageClick(it) {
        var This = it.data;
        var ps = {id: This.id}
        $.getJSON('/ServiceFramework/wc/save.data', ps, function (js, scope) {
            if (js.success) {

            } else {
                $.fn.alert({success: true, msg: js.msg});
            }
        });
    }

    function ShowUserImage(el, ds, config) {
        el.empty();
        var row = $('<ul class="row list-group"></ul>').appendTo(el);
        row.css('padding-top', 8);
        for (var i = 0; i < ds.length; i++) {
            var it = ds[i];
            var cls = true ? 'ok' : 'user';
            var tpl = '<li style="padding:5px;" class="list-group-item item-check"><div><i style="font-size:22px;color:#5CB85C;" class="glyphicon glyphicon-' + cls + '"></i></div></li>';
            it.Name = it.Name ? it.Name : it.cnname;

            var itemImg = $(utils.replaceTpl(tpl, it)).appendTo(row);
            itemImg.bind('click', it, function (e) {
                $(this).find('i').toggleClass('glyphicon-user');
                $(this).find('i').toggleClass('glyphicon-ok');
                var it = e.data;
                it.ID = it.id ? it.id : it.ID;
                ImageClick(it);
            });
        }
    }

    function ShowWorkday(el, ds, config) {
        el.empty();
        var row = $('<ul class="row list-group"></ul>').appendTo(el);
        row.css('padding-top', 8);
        for (var i = 0; i < ds.length; i++) {
            var it = ds[i];
            var tpl = '<li style="padding:5px;" class="list-group-item item-check"><div style="padding-top:3px;padding-bottom:3px;color:#5CB85C;">{Name}</div></li>';
            it.Name = it.Name ? it.Name : it.cnname;
            var itemImg = $(utils.replaceTpl(tpl, it)).appendTo(row);

        }
    }

    function LoadList(keyword, index, size) {
        var ps = {
            keyword: '' || keyword,
            isDeleted: 0,
            type: 0,
            fromdate: '',
            todate: '',
            index: index,
            size: size
        };
        $.getJSON('/ServiceFramework/wc/listwc2.data', ps, function (json, scope) {
            var data = json.data;

        });
    }

    function InitUI(el) {
        me.checkUIam = $('<div class="col-md-7">a</div>').appendTo(el);
        me.checkUIpm = $('<div class="col-md-7">a</div>').appendTo(el);
        me.infoUi = $('<div class="col-md-5">b</div>').appendTo(el);
        var ds = [{id: 1, cnname: '周一上午', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期二', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期三', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期四', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期五', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期六', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期日', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}]

        ShowUserImage(me.checkUIam, ds);
        ShowUserImage(me.checkUIpm, ds);
    }

    function Createworkday(el) {
        $('<div class="row"><h3 style="text-align:center;">签到足迹</h3></div>').appendTo(el);
        me.dayHead = $('<div class="row" style="border-top:solid 1px #DDD;padding:5px;"></div>').appendTo(el);
        $('<div class="col-md-3" style="text-align:center;">星期</div>').appendTo(me.dayHead).css('padding-left', 0).css('padding-right', 0);
        $('<div class="col-md-3" style="text-align:center;">上午</div>').appendTo(me.dayHead).css('padding-left', 0).css('padding-right', 0);
        $('<div class="col-md-3" style="text-align:center;">下午</div>').appendTo(me.dayHead).css('padding-left', 0).css('padding-right', 0);

        me.workday = $('<div class="row"></div>').appendTo(el);
        me.all = $('<div class="col-md-3"></div>').appendTo(me.workday);
        me.am = $('<div class="col-md-3"></div>').appendTo(me.workday);
        me.pm = $('<div class="col-md-3"></div>').appendTo(me.workday);
        var ds = [{id: 1, cnname: '周一', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周二', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周三', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周四', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周五', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周六', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周日', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}]

        //LoadList('',1,25);
        ShowWorkday(me.all, ds);
        ShowUserImage(me.am, ds);
        ShowUserImage(me.pm, ds);
    }

    function renderBlockInfo(el) {
        var tpl = '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">'
            + '<div class="databox radius-bordered databox-shadowed databox-graded">'
            + '<div class="databox-left bg-themesecondary">'
            + '<div class="databox-piechart">'
            + '<div data-toggle="easypiechart" class="easyPieChart" data-barcolor="#fff" data-linecap="butt" data-percent="50" data-animate="500" data-linewidth="3" data-size="47" data-trackcolor="rgba(255,255,255,0.1)"><span class="white font-90">50%</span></div>'
            + '</div>'
            + '</div>'
            + '<div class="databox-right">'
            + '<span class="databox-number themesecondary">14</span>'
            + '<div class="databox-text darkgray">NEW TASKS</div>'
            + '<div class="databox-stat themesecondary radius-bordered">'
            + '<i class="stat-icon icon-lg fa fa-tasks"></i>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
        $(utils.replaceTpl(tpl, {})).appendTo(el);
        renderBlockAlarmInfo(el);
        renderBlockAlarm2(el);
    }

    function renderBlockAlarmInfo(el) {
        var tpl = '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">'
            + '<div class="databox radius-bordered databox-shadowed databox-graded">'
            + '<div class="databox-left bg-themethirdcolor">'
            + '<div class="databox-piechart">'
            + '<div data-toggle="easypiechart" class="easyPieChart" data-barcolor="#fff" data-linecap="butt" data-percent="15" data-animate="500" data-linewidth="3" data-size="47" data-trackcolor="rgba(255,255,255,0.2)"><span class="white font-90">15%</span></div>'
            + '</div>'
            + '</div>'
            + '<div class="databox-right">'
            + '<span class="databox-number themethirdcolor">1</span>'
            + '<div class="databox-text darkgray">NEW MESSAGE</div>'
            + '<div class="databox-stat themethirdcolor radius-bordered">'
            + '<i class="stat-icon  icon-lg fa fa-envelope-o"></i>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
        $(utils.replaceTpl(tpl, {})).appendTo(el);
    }

    function renderBlockAlarm2(el) {
        var tpl = '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">'
            + '<div class="databox radius-bordered databox-shadowed databox-graded">'
            + '<div class="databox-left bg-themeprimary">'
            + '<div class="databox-piechart">'
            + '<div id="users-pie" data-toggle="easypiechart" class="easyPieChart" data-barcolor="#fff" data-linecap="butt" data-percent="76" data-animate="500" data-linewidth="3" data-size="47" data-trackcolor="rgba(255,255,255,0.1)"><span class="white font-90">76%</span></div>'
            + '</div>'
            + '</div>'
            + '<div class="databox-right">'
            + '<span class="databox-number themeprimary">98</span>'
            + '<div class="databox-text darkgray">NEW USERS</div>'
            + '<div class="databox-state bg-themeprimary">'
            + '<i class="fa fa-check"></i>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
        $(utils.replaceTpl(tpl, {})).appendTo(el);
    }


    function flash(args, tab) {
        if (tab.c.children().length == 0) {
            var body = $('<div class="panel-body" style="margin-left:0;margin-right:0px;"></div>').appendTo(tab.c);
            var temp = $('<div class="row" style="margin-left:0;margin-right:0px;"></div>').appendTo(body);
            renderBlockInfo(temp);
        }
        me.execCommand('show', {a: args.a});
        //me.fireEvent(args.b, tab.c);
    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });
};