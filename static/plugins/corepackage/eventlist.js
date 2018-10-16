IWF.plugins['eventlist'] = function () {
    var gisMap;//全局地图变量
    var rootPath;//全局后台接口url
    var basePath;//全局前端url
    var centerPointX = 116.123944;
    var centerPointY = 24.288561;
    var username;

    var pageSize = 4;
    var pageIndex = 1;
    var total;
    var pageCount;

    var me = this;
    me.ruleTree = [];
    var nav = {icon: 'icon-globe', color: 'icon-blue', title: '事件单历史轨迹', a: 'eventlist', b: 'eventlist'};


    me.addListener('init', function () {
        me.execCommand('addtab', nav);
    });


    function init() {
        nav.key = nav.a;
        if (me.execCommand('rules', nav)) {
            me.execCommand('addnav', nav);
        }
    }

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            bodyRoot = tab.c;
            var temp = $('<div id="event-giscontainer" ></div>').appendTo(tab.c);
            var a = $('<div id="eventlistcontainer" ></div>').appendTo(tab.c);
            temp.height(me.height());
            username = args.params.name;
            //初始化地图
            setTimeout(initMap, 100);

            loadEventlist(args);
            //收起和展开按钮
            $('.event-retract').delegate("#event-upicon", "click", upEvent);
            $('.event-retract').delegate("#event-downicon", "click", downEvent);
            $('.event-more img').bind("click", moreEvent);
            //加载事件

        }
        me.execCommand('show', {a: args.a});
    }

    function upEvent() {
        $('.event-root').hide();
        $('#event-upicon').replaceWith('<img id="event-downicon" src="./images/map8.png" />');
        ;
    }

    function downEvent() {
        $('.event-root').show();
        $('#event-downicon').replaceWith('<img id="event-upicon" src="./images/map7.png" />');
        ;
    }

    function moreEvent() {

        var url = rootPath + 'getPTemp/todo.do';
        var pageIndexVal = pageIndex + 1;
        var args = {"username": username, "pageSize": pageSize, "pageIndex": pageIndexVal};
        $.getJSON(url, args, function (data) {
            var eventlist = data.obj;
            for (i = 0; i < eventlist.length; i++) {
                var event = '<ul class="event-ul"><li class="event-item">' +
                    '<div class="event-info">' +
                    '<div class="spantable">接单时间:&nbsp;' + eventlist[i].acceptTime + '</div>' +
                    '<div class="spantable">编&nbsp;&nbsp;号:&nbsp;' + eventlist[i].number + '</div>' +
                    '<div class="spantable">标&nbsp;&nbsp;题:&nbsp;' + eventlist[i].title + '</div>' +
                    '<div class="spantable">耗时时长:&nbsp;' + eventlist[i].ctime + '</div>' +
                    '</div></li></ul>';

                $('.event-content').append(event);
            }
            $('.event-info').unbind("click").bind('click', loadTrail);
            pageIndex++;
        });
    }


    function loadEventlist(args) {

        var zoom = '<div class="event-retract"><img id="event-upicon"src="./images/map7.png" /></div>' +
            '<div class="event-root">' +
            '<div class="event-content"></div>' +
            '<div class=event-more><img id="event-moreicon"src="./images/map8.png" /></div></div>';
        $('#eventlistcontainer').append(zoom);
        var url = rootPath + "getPTemp/todo.do";
        var arg = {"username": username, "pageSize": pageSize, "pageIndex": pageIndex};
        $.getJSON(url, arg, function (data) {
            var eventlist = data.obj;
            for (i = 0; i < eventlist.length; i++) {
                var event = '<ul class="event-ul"><li class="event-item">' +
                    '<div class="event-info">' +
                    '<div class="spantable">接单时间:&nbsp;' + eventlist[i].acceptTime + '</div>' +
                    '<div class="spantable">编&nbsp;&nbsp;号:&nbsp;' + eventlist[i].number + '</div>' +
                    '<div class="spantable">标&nbsp;&nbsp;题:&nbsp;' + eventlist[i].title + '</div>' +
                    '<div class="spantable">耗时时长:&nbsp;' + eventlist[i].ctime + '</div>' +
                    '</div></li></ul>';

                $('.event-content').append(event);

            }
            $('.event-info').bind('click', loadTrail);
            //total = json.obj[0].total;
            //pageCount = parseInt(total/pageSize)+(total%pageSize >0 ?1:0);
        })
    }

    /*加载历史轨迹*/

    function loadTrail() {

        gisMap.clearOverlays();//清楚地图上所有覆盖物
        var eventNum = $(this).find('.spantable').eq(1).text();
        var num = eventNum.split(":")[1].replace(/(^\s*)/g, "");
        var arg = {"eventNum": num, "username": username, "pageSize": 1, "pageIndex": 1};
        var url = rootPath + 'getPTemp/his.do';
        $.getJSON(url, arg, function (json) {
            var data = json.obj;
            if (data == "") {
                return;
            }
            var polylinePointsArray = [];
            var start, end;
            for (i = 0; i < data.length; i++) {

                var x = data[i].lngLat.split(",")[0];
                var y = data[i].lngLat.split(",")[1];
                if (i == 0) {
                    start = new BMap.Point(x, y);
                }
                if (i == data.length - 1) {
                    end = new BMap.Point(x, y);
                }
                polylinePointsArray[i] = new BMap.Point(x, y);
            }
            var polyline = new BMap.Polyline(polylinePointsArray, {
                strokeColor: "red",
                strokeWeight: 3,
                strokeOpacity: 0.5
            });   //创建折线
            var startIcon = new BMap.Icon(basePath + "images/map10.png", new BMap.Size(33, 47), {anchor: new BMap.Size(16, 38)});
            var startmarker = new BMap.Marker(start, {icon: startIcon});  // 创建标注
            var endIcon = new BMap.Icon(basePath + "images/map11.png", new BMap.Size(33, 47), {anchor: new BMap.Size(16, 35)});
            var endmarker = new BMap.Marker(end, {icon: endIcon});  // 创建标注
            gisMap.addOverlay(polyline);   //增加折线
            gisMap.addOverlay(startmarker); //增加起点标注
            gisMap.addOverlay(endmarker); //增加结束点标注
            gisMap.centerAndZoom(start, getZoom(start, end)); //设置中心点和缩放比例
        })
    }

    /*获取缩放比例*/
    function getZoom(startpoint, endpoint) {
        var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。
        var distance = gisMap.getDistance(startpoint, endpoint).toFixed(1);  //获取两点距离,保留小数点后两位
        for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
            if (zoom[i] - distance > 0) {
                return 18 - i + 3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
            }
        }
    }

    function initMap() {
        gisMap = new BMap.Map("event-giscontainer");// 创建地图实例
        gisMap.enableScrollWheelZoom(true);//地图可拖拽
        var point = new BMap.Point(centerPointX, centerPointY); //创建点坐标
        gisMap.centerAndZoom(point, 10);// 初始化地图，设置中心点坐标和地图级别

        //添加地图工具
        gisMap.addControl(new BMap.NavigationControl());
        gisMap.addControl(new BMap.ScaleControl());
        gisMap.addControl(new BMap.OverviewMapControl());
        gisMap.addControl(new BMap.MapTypeControl());
    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            rootPath = me.rootPath + "mz_gps/";
            var basePathurl = me.body.baseURI;
            basePath = basePathurl.substring(0, basePathurl.lastIndexOf("\/") + 1);
            flash(args, tab);
            tab.c.siblings().hide();

            me.execCommand('show', args);
        }
    });
};