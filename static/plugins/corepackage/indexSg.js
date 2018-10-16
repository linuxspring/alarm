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

            case "tab3":
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
            case 'tab4':
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
        el.load("plugins/newpackage/html/indexSg.html", function (e) {

            $(this).find('a').bind('click', appclick);

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

    function addEvents() {
        $('.count-left img').bind("click", leftMoveCount)
        $('.count-right img').bind("click", rightMoveCount);
        $('.count-retract').delegate("#count-upicon", "click", upCount);
        $('.count-retract').delegate("#count-downicon", "click", downCount);
        $('.statistic-retract').delegate("#statistic-upicon", "click", upStatistic);
        $('.statistic-retract').delegate("#statistic-downicon", "click", downStatistic);

    }


    function statisticTableInterval() {
        var url = rootPath + 'sum.do?';
        $.getJSON(url, function (data) {
            var json = data.obj;
            $('.statistic-value span span:eq(0)').html(json[0].sum);
            $('.statistic-value span span:eq(1)').html(json[0].yes);
            $('.statistic-value span span:eq(2)').html(json[0].no);
        });
    }

    function countInterval() {
        var url = rootPath + 'detail.do?';
        var args = {"pageSize": pageSize, "pageIndex": pageIndex};
        $.getJSON(url, args, function (json) {
            var rowArr = json.obj[0].rows;
            for (i = 0; i < rowArr.length; i++) {
                $('.count-spanvalue span:eq(' + i + ')').html(rowArr[i].count);
            }
        });
    }

    function mainInterval() {

    }

    function leftMoveCount() {
        var pageIndexVal = pageIndex - 1;
        if (pageIndexVal < 1) {
            return;
        }
        $('.count-root').empty();
        for (i = pageSize * (pageIndexVal - 1); i < pageSize * pageIndexVal; i++) {
            var content = '<div class="count-info"><img src="./images/map12.png" />&nbsp;<span class="count-spantable">' + totalRows[i].assigneeName + ':&nbsp;</span><span class="count-spanvalue">' + totalRows[i].count + '</span></div>';
            $('.count-root').append(content);
        }
        pageIndex--;
    }

    function upCount() {
        $('.count-content').hide();
        $('#count-upicon').replaceWith('<img id="count-downicon" src="./images/map8.png" />');
        ;
    }

    function downCount() {
        $('.count-content').show();
        $('#count-downicon').replaceWith('<img id="count-upicon" src="./images/map7.png" />');
        ;
    }

    function upStatistic() {
        $('.statistic-content').hide();
        $('#statistic-upicon').replaceWith('<img id="statistic-downicon" src="./images/map8.png" />');
        ;
    }

    function downStatistic() {
        $('.statistic-content').show();
        $('#statistic-downicon').replaceWith('<img id="statistic-upicon" src="./images/map7.png" />');
        ;
    }

    function rightMoveCount() {

        var pageIndexVal = pageIndex + 1;
        if (pageIndexVal > pageCount) {
            return;
        }
        $('.count-root').empty();
        for (i = pageSize * (pageIndexVal - 1); i < pageSize * pageIndexVal; i++) {
            if (totalRows.length <= i) {
                break;
            }
            var content = '<div class="count-info"><img src="./images/map12.png" />&nbsp;<span class="count-spantable">' + totalRows[i].assigneeName + ':&nbsp;</span><span class="count-spanvalue">' + totalRows[i].count + '</span></div>';
            $('.count-root').append(content);
        }
        pageIndex++;
    }


    function loadCount() {
        var downIcon = '<div class="count-retract">二线人员接单数量&nbsp;&nbsp;&nbsp;<img id="count-upicon" src="./images/map7.png" /></div>';
        var content = '<div class="count-content"></div>';
        var leftIcon = '<div class="count-left"><img src="./images/map6.png" /></div>';
        var countContentIcon = '<div class="count-root"></div>';
        var rightIcon = '<div class="count-right"><img src="./images/map5.png" /></div>';
        $('#countcontainer').append(downIcon);
        $('#countcontainer').append(content);
        $('.count-content').append(leftIcon);
        $('.count-content').append(countContentIcon);
        $('.count-content').append(rightIcon);
        var url = rootPath + 'detail.do?';
        var args = {"pageSize": 100, "pageIndex": pageIndex};
        $.ajaxSettings.async = false;
        $.getJSON(url, args, function (json) {

            totalRows = json.obj[0].rows;
            for (i = 0; i < 4; i++) {
                var content = '<div class="count-info"><img src="./images/map12.png" />&nbsp;<span class="count-spantable">' + totalRows[i].assigneeName + ':&nbsp;</span><span class="count-spanvalue">' + totalRows[i].count + '</span></div>';
                $('.count-root').append(content);
            }
            total = json.obj[0].total;
            pageCount = parseInt(total / pageSize) + (total % pageSize > 0 ? 1 : 0);
        });
        $.ajaxSettings.async = true;

    }


    //加载统计人数列表
    function loadStatisticTable() {
        var downIcon = '<div class="statistic-retract">人数统计&nbsp;&nbsp;&nbsp;<img id="statistic-upicon" src="./images/map7.png" /></div>';
        var content = '<div class="statistic-content"></div>';
        $('#statisticcontainer').append(downIcon);
        $('#statisticcontainer').append(content);
        var url = rootPath + 'sum.do?';
        $.getJSON(url, function (data) {
            var json = data.obj;
            var statisticContent = '<div class="statistic-root"> <span class="statistic-label"><img src="./images/map12.png" />&nbsp;二线工程师总人数:&nbsp;</span><span class="statistic-value">' + json[0].sum + '</span></div>' +
                '<div class="statistic-root"><span class="statistic-label"><img src="./images/map12.png" />&nbsp;已结单人数:&nbsp;</span><span class="statistic-value">' + json[0].yes + '</span></div>' +
                '<div class="statistic-root"><span class="statistic-label"><img src="./images/map12.png" />&nbsp;未接单人数:&nbsp;</span><span class="statistic-value">' + json[0].no + '</span></div>';
            $('.statistic-content').append(statisticContent);
        });
    }

    function loadMarker() {
        var url = rootPath + "getPTemp/temp.do";
        var args = {"pageSize": pageSize, "pageIndex": 1};
        $.getJSON(url, args, function (data) {
            var pointArr = data.obj;
            if (pointArr != 0) {
                gisMap.clearOverlays();
            }
            var pointLen = pointArr.length;

            //渲染二线人员marker
            for (var i = 0; i < pointLen; i++) {
                var pointX = pointArr[i].lngLat.split(",")[0];
                var pointY = pointArr[i].lngLat.split(",")[1];
                var fullName = pointArr[i].fullName;
                var username = pointArr[i].username;
                var eventlist = pointArr[i].eventlist;
                var point = new BMap.Point(pointX, pointY);
                var Icon;
                var marker;
                var label;
                var eventCount;
                for (var j = 0; j < totalRows.length; j++) {
                    if (totalRows[j].assigneeName == fullName) {
                        eventCount = totalRows[j].count;
                        break;
                    }
                }
                if (eventCount > 0) {
                    Icon = new BMap.Icon(basePath + "images/map3.png", new BMap.Size(97, 79), {anchor: new BMap.Size(49, 79)});
                    marker = new BMap.Marker(point, {icon: Icon});  // 创建标注
                } else {
                    Icon = new BMap.Icon(basePath + "images/map4.png", new BMap.Size(97, 79), {anchor: new BMap.Size(49, 79)});
                    marker = new BMap.Marker(point, {icon: Icon});  // 创建标注
                }
                label = new BMap.Label(fullName, {offset: new BMap.Size(22, 3)});
                label.setStyle({backgroundColor: "none", border: "0px", color: "#FFF", fontSize: "18px"});
                marker.setLabel(label);
                //****鼠标事件监听：显示单号列表

                marker.addEventListener("mouseover", function () {
                    var url = rootPath + "getPro.do";
                    var b = this;
                    var label = this.getLabel();
                    username = label.content;
                    for (var j = 0; j < totalRows.length; j++) {
                        if (totalRows[j].assigneeName == username) {
                            username = totalRows[j].username;
                        }
                    }
                    var args = {"username": username, "pageSize": pageSize, "pageIndex": 1};
                    $.getJSON(url, args, function (data) {
                        var events = data.obj;
                        var sContent = '<div class="mapContent-root">';
                        for (var k = 0; k < events.length; k++) {
                            var html = '<div class="mapContent-info"><img src="./images/map12.png" />&nbsp;</span><span class="mapContent-value">' + events[k] + '</span></div>';
                            sContent += html;
                        }
                        sContent = sContent + "</div>";
                        var opts = {
                            width: 200,     // 信息窗口宽度
                            height: 80,     // 信息窗口高度
                        }
                        var infoWindow = new BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象
                        b.openInfoWindow(infoWindow);

                    });
                });
                /*marker.addEventListener("mouseout", function(){
                 this.closeInfoWindow();
                 });*/


                //******跳转到历史轨迹页面
                marker.addEventListener("click", function () {
                    var label = this.getLabel();
                    var name = label.content;
                    for (var j = 0; j < totalRows.length; j++) {
                        if (totalRows[j].assigneeName == name) {
                            name = totalRows[j].username;
                            break;
                        }
                    }
                    var data = {
                        icon: 'icon-globe',
                        color: 'icon-blue',
                        title: '事件单历史轨迹',
                        a: 'eventlist',
                        b: 'eventlist',
                        index: 2
                    };
                    data.params = {"name": name};
                    me.execCommand('go', data);
                });
                gisMap.addOverlay(marker);

            }//for结束
        });
    }

    /*gps地图相关---------------------------------------------------------------------*/
};
