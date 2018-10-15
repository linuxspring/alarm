IWF.plugins['recicase'] = function () {

    var me = this;

    var nav = {icon: 'icon-briefcase', title: '事件单', a: 'recicase', b: 'recicase', index: 2, canClose: true};
    var url = me.rootPath + 'zq_todo/probOne.do';
    var userName = me.options.userInfo.name; //me.options.userInfo.name
    var solveTodoUrl = me.rootPath + 'mz_gps/saveTodo.do';
    var positionSwitch = me.options.userInfo.positionSwitch;

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
        var data = {icon: 'icon-globe', title: '我的待办', a: 'doingcase', b: 'doingcase'};
        me.execCommand('go', data);
    }


    function InitUI(el) {
        el.empty();
        var tplBack = '<div class="header"> <a href="javascript:void(0);" class="back"></a>事件单 ' +
            '<a href="javascript:void(0);" style="color: black; text-decoration: none;"><span class="glyphicon glyphicon-plus jiahao" id="share"></span> </a></div> ';
        me.topTool = $(tplBack).appendTo(el);
        me.topTool.find('a').bind('click', function (e) {
            var data = {icon: 'icon-globe', title: '事件单列表', a: 'dealing', b: 'dealing', params: {status: '02'}};
            me.execCommand('go', data);
        });

        me.topTool.find('#share').bind('click', function (e) {

        });
    }


    function getmethod(a) {
        var b = '';
        switch (a) {
            case'远程解决':
                b = '0';
                break;
            case'现场解决':
                b = '1';
                break;
            case'电话解决':
                b = '2';
                break;
            case'其他解决':
                b = '3';
                break;
        }
        return b;
    }

    function getresult(a) {
        var b = '';
        switch (a) {
            case'一线解决/根本解决':
                b = '0';
                break;
            case'二线解决/根本解决':
                b = '1';
                break;
            case'三线解决/根本解决':
                b = '2';
                break;
            case'现场解决':
                b = '3';
                break;
        }
        return b;
    }

    function InitBody(el, p1) {
        el.empty();
        el.load("plugins/todopackage/html/eventList.html", function (e) {
            loadPage(el, p1);

            $(this).find('a').bind('click', el, function () {

                var c = el.find('#eventNumber').text();
                var solvemethod = getmethod(el.find('.txt.mark-a').text());
                var result = getresult(el.find('.txt.mark-b').text());
                var zsk = el.find('.wz.mark-c').text();
                var solution = el.find('#solve').val();
                var number = el.find('#eventNumber').text();
                var title = el.find('#title').text();
                switch (this.id) {

                    case 'detail':
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '事件单详情',
                            a: 'casedetail',
                            b: 'casedetail',
                            index: 4,
                            params: {number: c}
                        };
                        me.execCommand('go', data);
                        break;
                    case "save":
                        var saveurl = me.rootPath + 'zq_todo/s/save.do';
                        var ps = {
                            usernameId: iwfTool.encryptByDES(userName),
                            number: iwfTool.encryptByDES(number),
                            cssSolveMethod: solvemethod,
                            resolutionCode: result,
                            resolution: solution,
                            signature: '',
                            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
                            key: me.options.token.key
                        };
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            url: saveurl,
                            data: ps,
                            success: function (json) {
                                qiao.bs.msg({
                                    msg: json.msg,
                                    type: 'success'
                                });
                            }
                        });

                        break;
                    case 'guaqi':
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '挂起',
                            a: 'guaqi',
                            b: 'guaqi',
                            index: 4,
                            params: {number: c}
                        };
                        me.execCommand('go', data);
                        break;
                    case "send":
                        var data = {
                            icon: 'icon-globe',
                            color: 'icon-blue',
                            title: '转派',
                            a: 'turntosend',
                            b: 'turntosend',
                            index: 3,
                            params: {number: number, status: '02'}
                        };
                        me.execCommand('go', data);
                        break;
                    case "solve":
                        var solveurl = me.rootPath + 'zq_todo/s/solve.do';
                        if (solution != "") {
                            if (solution.length < 400) {

                                var ps = {
                                    usernameId: iwfTool.encryptByDES(userName),
                                    number: iwfTool.encryptByDES(number),
                                    cssSolveMethod: solvemethod,
                                    resolutionCode: result,
                                    resolution: solution,
                                    signature: '',
                                    accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
                                    key: me.options.token.key
                                };

                                $.post(solveurl, ps, function (json) {
                                    if (json.success == true) {
                                        /*-----------------------梅州地图位置上传相关--分割线开始--------------------------------------------*/
                                        if (positionSwitch.indexOf("true") != -1) {
                                            upUserPositionForSolve(userName, number, title, me.options.token.key, me.options.token.accessToken);
                                        }
                                        /*-----------------------梅州地图位置上传相关--分割线结束--------------------------------------------*/

                                        qiao.bs.msg({
                                            msg: '事件单解决成功!',
                                            type: 'success'
                                        });
                                        if (zsk == '是') {
                                            var data = {
                                                icon: 'icon-globe',
                                                color: 'icon-blue',
                                                title: '新建知识库',
                                                a: 'newCreateKnowledge',
                                                b: 'newCreateKnowledge',
                                                params: {number: number, solution: solution}
                                            };
                                            me.execCommand('go', data);
                                        } else {

                                            var data = {
                                                icon: 'icon-globe',
                                                color: 'icon-blue',
                                                title: '待办',
                                                a: 'doingcase',
                                                b: 'doingcase',
                                                index: 3
                                            };
                                            me.execCommand('go', data);
                                        }
                                    } else {
                                        qiao.bs.msg({
                                            msg: json.msg,
                                            type: 'danger'
                                        });
                                    }
                                }, 'json');
                            } else {
                                qiao.bs.msg({
                                    msg: '解决方案字数过多!',
                                    type: 'info'
                                });
                            }
                        } else {
                            qiao.bs.msg({
                                msg: '解决方案不能为空!',
                                type: 'info'
                            });
                        }
                        break;
                }
            });
        })
    }

    //上传用户位置的方法
    function quitUpPosition() {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var marker = new BMap.Marker(r.point);
                var hisUrl = me.rootPath + 'mz_gps/saveHis.do';
                var todoUrl = me.rootPath + 'mz_gps/saveTodo.do';
                var eventNum = me.bodyRoot.find('#eventNumber').text();
                var params = {
                    username: me.options.userInfo.name,
                    lngLat: r.point.lng + "," + r.point.lat,
                    cssStatus: "03",
                    eventNum: eventNum,
                    mapType: "接受操作-测试"
                }
                $.post(hisUrl, params, function (data, status) {
                    alert(data + "   11");
                    var json = JSON.parse(data);
                    if (!json.success) {
                        clearInterval(intervalId);
                    }
                });
                $.post(todoUrl, params, function (data, status) {
                    alert(data + "   22");
                    var json = JSON.parse(data);
                    if (!json.success) {
                        clearInterval(intervalId);
                    }
                });
            }
        }, {enableHighAccuracy: true})
    }

    function loadPage(el, p1) {
        var usernameId = userName;
        var ps = {
            number: iwfTool.encryptByDES(p1),
            accessToken: iwfTool.encryptByDES(me.options.token.accessToken),
            key: me.options.token.key
        }
        $.getJSON(url, ps, function (json, scope) {
            if (json.success) {
                var data = json.obj[0].prob;
                if (data != '') {

                    el.find('#title').text(data.title);
                    el.find('#reporter').text(data.openedBy);
                    el.find('#eventNumber').text(data.number);
                    el.find('#solve').val(data.resolution);
                    var method = data.cssSolveMethod;
                    var code = data.resolutionCode;
                    var a = el.find('#remote').text();
                    var b = el.find('#live').text();
                    var c = el.find('#phone').text();
                    var d = el.find('#other').text();
                    var one = el.find('#first').text();
                    var two = el.find('#second').text();
                    var three = el.find('#third').text();       //var four=el.find('#xianchang').text();
                    switch (method) {
                        case  a:
                            el.find('#yc').addClass('cur');
                            el.find('#remote').addClass('mark-a');
                            break;
                        case  b:
                            el.find('#xc').addClass('cur');
                            el.find('#live').addClass('mark-a');
                            break;
                        case  c:
                            el.find('#dh').addClass('cur');
                            el.find('#phone').addClass('mark-a');
                            break;
                        case  d:
                            el.find('#qt').addClass('cur');
                            el.find('#other').addClass('mark-a');
                            break;
                        default :
                            el.find('#yc').addClass('cur');
                            el.find('#remote').addClass('mark-a');
                            break;
                    }

                    switch (code) {
                        case  one:
                            el.find('#yx').addClass('cur');
                            el.find('#first').addClass('mark-b');
                            break;
                        case  two:
                            el.find('#rx').addClass('cur');
                            el.find('#second').addClass('mark-b');
                            break;
                        case  three:
                            el.find('#sx').addClass('cur');
                            el.find('#third').addClass('mark-b');
                            break;
//							case  four:
//								el.find('#wx').addClass('cur');
//			    				el.find('#xianchang').addClass('mark-b');
//								break;
                        default:
                            el.find('#yx').addClass('cur');
                            el.find('#first').addClass('mark-b');
                            break;
                    }
                } else {
                    qiao.bs.msg({
                        msg: '暂无数据',
                        type: 'info'
                    });
                }

            } else {
                qiao.bs.msg({
                    msg: json.msg,
                    type: 'danger'
                });
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

    }

    me.addListener('do', function (key, args) {
        if (args.b == "recicase") {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            var p1 = args.params.number;
            flash(tab, p1);
            tab.c.siblings().hide();
            me.execCommand('show', args);
        }
    });
}