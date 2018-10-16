IWF.plugins['fenpaitask'] = function () {

    var me = this;
    var nav = {
        icon: 'icon-calendar',
        title: '新建分派任务',
        a: 'fenpaitask',
        b: 'fenpaitask',
        index: 3,
        canClose: true
    };
    var tplBar = '<div class="progress" style="width:80px;margin-bottom: 0px;background-color: #9f9f9f">'
        + '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: {proeccess}">'
        + '<span >{proeccess}</span>'
        + '</div>'
        + '</div>';
    var config = {
        getYuan: function (yuan, autoid) {

            return (yuan == "超时") ? '<img src="ref/ztree/css/zTreeStyle/img/diy/10.png" height="15" width="15" alt="" style="vertical-align:middle;">'
                : '<img src="resources/default/images/yuan.png" height="15" width="15" alt="" style="vertical-align:middle;">';
        },
        columns: [{
            title: '<input type="checkbox" />',
            text: '<input type="checkbox" />',
            width: '3%',
            click: true
        }, {
            title: '<img height="15" width="15" src="resources/default/images/yuan.png" alt="" />' + ' ' + '编号',
            text: '<div style="vertical-align:middle;">{getYuan(status)}' + '<span style="height: 100%;vertical-align: middle;display: inline-block">{autoid}</span></div>',
            width: '10%',
            sortable: true
        }, {
            title: '级别',
            text: '{levels}',
            width: '5%'
        }, {
            title: '任务标题',
            text: '{name}',
            width: '12%'
        }, {
            title: '任务内容',
            text: '{remark}',
            width: '20%'
        }, {
            title: '主要负责人',
            text: '{manager}',
            width: '10%'
        }, {
            title: '计划完成时间',
            text: '{plan_endtime}',
            width: '13%',
            sortable: true
        }, {
            title: '任务状态',
            text: '{status}',
            width: '10%'
        }, {
            title: '完成进度',
            text: tplBar,
            width: '10%',
            sortable: true
        },

        ],
        linkclick: function (sender, data) {
            var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            //LoadEpInfo(data);
            GetGoodsByEpId(me.epItemListEl, 1, 25, data);
        },
        sort: function (index, col, isDesc) {
            var week = '';
            var month = '';
            var dept = '';
            var group = '';
            var starttime = '';
            var endtime = '';
            var sort = 'id';
            var ownerid = '';

            switch (index) {
                case 1:
                    sort = 'id';
                    break;
                case 2:
                    sort = 'levels';
                    break;
                case 3:
                    sort = 'name';
                    break;
                case 4:
                    sort = 'remark';
                    break;
                case 5:
                    sort = 'manager';
                    break;
                case 6:
                    sort = 'plan_endtime';
                    break;
                case 8:
                    sort = 'proeccess';
                    break;
                default:
                    'id';
            }


            if ($('#week').prop('checked') == true)
                week = 1;
            if ($('#month').prop('checked') == true)
                month = 1;
            if ($('#dept').prop('checked') == true)
                dept = 1;
            if ($('#group').prop('checked') == true)
                group = 1;
            if ($('#starttime').val() != null)
                starttime = $('#starttime').val();
            if ($('#endtime').val() != null)
                endtime = $('#endtime').val();
            if ($('#assignee').val() != null)
                ownerid = $('#assignee').val();

            var search = {
                userid: me.options.userInfo.id,
                weekpoint: week,
                monthpoint: month,
                ownerid: ownerid,
                deptpoint: dept,
                grouppoint: group,
                starttime: starttime,
                endtime: endtime,
                sort: sort,
                desc: isDesc
            };
            var ps = {

                index: 1,
                size: 20,
                json: utils.fromJSON(search),
                keyword: me.flowbox.find(':input').val(),
                type: 1
                //1我的任务;2我分派;3历史;4全部
            };
            var pageConfig = {
                total: 0,
                pageSize: 20,
                pageCount: 0,
                pageIndex: 1,
                pageclick: function (pageIndex, pageSize) {
                    LoadLitchi('', pageIndex, pageSize);
                }
            };


            $.post(me.rootPath + 'task/view.data', ps, function (js, scope) {
                me.flowTool.PageBar(pageConfig, js);
                config.data = js.rows;
                me.dataGrid = me.flowGrid.iwfGrid(config);
            }, 'json');
        },
        rowclick: function (sender) {
            alert(sender.data);
        }
    };

    function collectionParams() {
        return {
            userid: me.options.userInfo.id,
            weekpoint: 0,
            monthpoint: 0,
            deptpoint: 0,
            grouppoint: 0,
            ownerid: '',
            starttime: '',
            endtime: '',
            sort: 'id',
            desc: 'true'
        };
    }

    function taskDetail(e) {
        var arr = me.dataGrid.getSelected();
        if (arr.length == 0) {
            return $.fn.alert({
                success: true,
                msg: '请先选择记录'
            });
        } else if (arr.length > 1) {
            return $.fn.alert({
                success: true,
                msg: '只能选择一条记录'
            });
        }
        //me.flowTool.empty();
        var This = {};
        This.id = arr[0].id;
        This.username = "";
        var data = {icon: 'icon-sitemap', color: 'icon-red', 'a': 'taskdetail', 'b': 'taskdetail', params: This};
        var meTaskDetail = window.framework;
        meTaskDetail.execCommand('go', data);
    }

    function SearchMenu(keyword) {
        //if(utils.isEmptyObject(keyword)){
        //   return;
        // }

        var treeObj = me.dataGrid;//$.fn.zTree.getZTreeObj("tree-obj");
        //var keywords=$("#keyword").val();
        //LoadMenu(keyword,1,9999);
        LoadLitchi(keyword, 1, 20);
        //var nodes = treeObj.getNodesByParamFuzzy("manager", keyword, null);
        //if (nodes.length>0) {
        //    treeObj.selectNode(nodes[0]);
        //}
    }

    function getAssignee_search(el, name, keyword) {
        var assignerUrl = me.rootPath + 'user/findbyfullname.data';

        $.post(assignerUrl, {
            fullname: ''
        }, function (json, scope) {

            var data = json;
            el.find('#assignee_search').empty();
            el.find('#assignee_search').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                el.find('#assignee_search').append(
                    '<option value="' + data[i].id + '">'
                    + data[i].fullname + '</option>');
            }

        }, 'json');
    }

    function fzqSubTaskBandEvent(el, type, comments) {
        //删掉多余部分
        el.find('.otherItem').remove();
        el.find('.comments').val(comments);
        //绑定关闭事件
        el.find('.close').on('click', function () {
            $(this).parent().remove();
        });
        el.find('.plan_endtime').each(function () {
            laydate.render({
                elem: this,
                trigger: 'click',
                format: 'yyyy-MM-dd HH:mm:ss',
                type: 'datetime',
                theme: 'molv',
                min: new Date().getTime(),
                value: new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + ' 18:00:00'

            });
        });
        if (type == 1) {
            $('.plan_endtime').hide();
            $('.plan_endtime_text').hide();
        }
        el.find('.ownername').on('click', function () {
            loadDevTypes($(this));
        });
    }

    function fzqBindEvent(elem, type) {
        //给日期绑定laydate
        //保证绑定的是e下面的元素

        elem.find('#plan_endtime').each(function () {
            laydate.render({
                elem: this,
                trigger: 'click',
                format: 'yyyy-MM-dd HH:mm:ss',
                type: 'datetime',
                theme: 'molv',
                min: new Date().getTime(),
                value: new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + ' 18:00:00'
            });
        });

        var oneSubTask = elem.find('.subTaskItem');

        var aSubTask = "";

        elem.find('#addLine').on('click', function () {

            if (aSubTask == "") {
                oneSubTask.load('forms/F000003/addSubTask.html', function (subElem) {

                    //因为这是ajax。所以在外面还要做一遍。

                    fzqSubTaskBandEvent(oneSubTask, type, elem.find('#remark').val());

                    aSubTask = subElem;


                });
            } else {
                elem.find('.subTaskItem').append(aSubTask);
                elem.find('.subTaskItem').find('.otherItem').remove();

                fzqSubTaskBandEvent(oneSubTask, type, $('#comments').val());
            }

        });


    }

    function zqBindEvent(elem) {

        elem.find('#zhouQiTask').load('forms/F000003/addZhouQiTask.html', function (e) {
            var other = '<label class="col-lg-2 control-label">周期为(天)：</label>'
                + '<div class="col-lg-4">'
                + '<input type="number" class="form-control " id="taskday"></div>';

            elem.find('#taskcycle').on('change', function () {

                if ($(this).val() == 2) {
                    elem.find('#other').append(other);
                    elem.find('#preText').text('周期第');
                    elem.find('#sufText').text('天完成');
                    elem.find('#finishTask').empty();
                    elem.find('#finishTask').append('<input type="number" class="form-control " id="taskfinish">');

                } else if ($(this).val() == 1) {
                    elem.find('#other').empty();
                    elem.find('#preText').text('每月');
                    elem.find('#sufText').text('号完成');
                    elem.find('#finishTask').empty();
                    elem.find('#finishTask').append(
                        '<input type="number" class="form-control " id="taskfinish">');

                } else {
                    elem.find('#other').empty();
                    elem.find('#preText').text('每周');
                    elem.find('#sufText').text('完成');
                    elem.find('#finishTask').empty();
                    elem.find('#finishTask').append(
                        '<select class="form-control" id="taskfinish">'
                        + '<option value="1">一</option>'
                        + '<option value="2">二</option>'
                        + '<option value="3">三</option>'
                        + '<option value="4">四</option>'
                        + '<option value="5">五</option>'
                        + '<option value="6">六</option>'
                        + '<option value="7">日</option>'
                        + '</select>');

                }
            });
        });


    }

    function addTask(e) {

        me.flowTool.empty();
        var This = {};

        me.pnl = me.flowGrid.Form({
            html: 'forms/F000003/addTask.html',
            title: '新建任务',
            load: function (e) {
                loadDeptUserTree(e);
                e.find('#ownerid').val(me.options.userInfo.id);
                e.find('#ownername').val(me.options.userInfo.fullname);
                e.find('#type').on("change", function () {
                    if ($(this).val() == 0) {
                        e.find('#zhouQiTask').empty();
                        e.find('#feiZhouQiTask').empty();
                        $("#totime").html("总时间节点：");
                        var feiZhouQiTaskHtml = '<div class="subTaskItem">'
                            + '</div><div><div class="form-group">'
                            + '<label class="col-lg-2 control-label">'
                            + '<button class="btn btn-info" id="addLine">分解子任务</button>'
                            + '</label></div></div>';

                        $(feiZhouQiTaskHtml).appendTo(e.find('#feiZhouQiTask'));
                        fzqBindEvent(e, 0);


                    } else {
                        e.find('#feiZhouQiTask').empty();
                        e.find('#zhouQiTask').empty();
                        $("#totime").html("起始时间节点：");
                        zqBindEvent(e);
                        var feiZhouQiTaskHtml = '<div class="subTaskItem">'
                            + '</div><div><div class="form-group">'
                            + '<label class="col-lg-2 control-label">'
                            + '<button class="btn btn-info" id="addLine">分解子任务</button>'
                            + '</label></div></div>';

                        $(feiZhouQiTaskHtml).appendTo(e.find('#feiZhouQiTask'));
                        fzqBindEvent(e, 1);
                    }
                });

                fzqBindEvent(e, 0);

            },
            click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;

                    var mainTask = {};
                    mainTask.weekpoint = el.find('#weekpoint').prop('checked') ? 1 : 0;
                    mainTask.monthpoint = el.find('#monthpoint').prop('checked') ? 1 : 0;
                    mainTask.deptpoint = el.find('#deptpoint').prop('checked') ? 1 : 0;
                    mainTask.grouppoint = el.find('#grouppoint').prop('checked') ? 1 : 0;
                    mainTask.type = el.find('#type').val();
                    mainTask.plan_endtime = el.find('#plan_endtime').val();
                    mainTask.name = el.find('#name').val();
                    mainTask.ownerid = el.find('#ownerid').val();
                    mainTask.remark = el.find('#remark').val();
                    mainTask.openid = me.options.userInfo.id;
                    if (!mainTask.plan_endtime)
                        return $.fn.alert({success: true, msg: '请填写时间节点'});
                    if (!mainTask.name)
                        return $.fn.alert({success: true, msg: '请填写任务标题'});
                    if (!mainTask.ownerid)
                        return $.fn.alert({success: true, msg: '请填写负责人'});
                    if (!mainTask.remark)
                        return $.fn.alert({success: true, msg: '请填写任务内容'});

                    var assignTask = [];

                    if (mainTask.type == 0) {


                    } else {
                        //周期任务
                        mainTask.taskcycle = el.find('#taskcycle').val();
                        if (mainTask.taskcycle == 2) {

                            mainTask.taskday = el.find('#taskday').val();
                            if (!mainTask.taskday)
                                return $.fn.alert({success: true, msg: '请填写周期'});
                        }

                        mainTask.tasknumber = el.find('#tasknumber').val();
                        mainTask.taskfinish = el.find('#taskfinish').val();
                        if (!mainTask.taskfinish)
                            return $.fn.alert({success: true, msg: '请填写完成日期'});
                        if (mainTask.type == 1 && (mainTask.taskfinish <= 0 || mainTask.taskfinish >= 32))
                            return $.fn.alert({success: true, msg: '请填写数字1-31'});
                        if (!mainTask.tasknumber)
                            return $.fn.alert({success: true, msg: '请填写周期个数'});
                    }

                    if (el.find('.ownerid').length > 0) {
                        var owneridArr = el.find('.ownerid');
                        var rateArr = el.find('.rate');
                        var plan_endtimeArr = el.find('.plan_endtime');
                        var remarkArr = el.find('.comments');
                        var rateCheck = 0;
                        for (var i = 0; i < owneridArr.length; i++) {

                            if (owneridArr[i].value == "") {
                                continue;
                            }

                            if (!$.isNumeric(rateArr[i].value) && rateArr[i].value != "") {
                                return $.fn.alert({success: true, msg: '占比非数字！'});
                            }
                            if (!plan_endtimeArr[i].value && mainTask.type == 0) {
                                return $.fn.alert({success: true, msg: '请填写完成时间！'});
                            }
                            if (!owneridArr[i].value) {
                                return $.fn.alert({success: true, msg: '请填写负责人！'});
                            }
                            if (!remarkArr[i].value) {
                                return $.fn.alert({success: true, msg: '请填写任务内容！'});
                            }
                            assignTask[i] = {
                                ownerid: owneridArr[i].value,
                                rate: rateArr[i].value,
                                plan_endtime: plan_endtimeArr[i].value,
                                remark: remarkArr[i].value,
                                openid: me.options.userInfo.id
                            };

                            rateCheck = rateCheck + Number(rateArr[i].value);
                        }

                        if (rateCheck != 100) {
                            return $.fn.alert({success: true, msg: '下发后占比总和必须为100！'});
                        }

                    }

                    This.assignTask = assignTask;//子任务
                    This.mainTask = mainTask; //任务
                    $.post(me.rootPath + 'task/openTask.data', {
                        json: utils.fromJSON(This)
                    }, function (json, scope) {
                        if (json.success) {
                            InitLeftToolbar(me.flowTool.parent());
                            LoadLitchi('', 1, 20);
                        } else {
                            $.fn.alert({
                                success: true,
                                msg: json.msg
                            });
                        }
                    }, 'json');
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadLitchi('', 1, 20);
                }
            }
        });
    }

    function LoadLitchi(keyword, index, size) {
        var ps = {

            index: index,
            size: size,
            keyword: keyword,
            json: utils.fromJSON(collectionParams()),
            type: 2
            //1我的任务;2我分派;3历史;4全部
        };
        var pageConfig = {
            total: 0,
            pageSize: 20,
            pageCount: 0,
            pageIndex: 1,
            pageclick: function (pageIndex, pageSize) {
                LoadLitchi('', pageIndex, pageSize);
            }
        };

        $.post(me.rootPath + 'task/view.data', ps, function (js, scope) {
            me.flowTool.PageBar(pageConfig, js);
            config.data = js.rows;
            me.dataGrid = me.flowGrid.iwfGrid(config);
        }, 'json');
    }

    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        me.flowTool.ToolBar(toolConfig);

        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);

        me.flowbox = me.flowform.SearchBox({
                layout: 'right', click: function (e) {
                    SearchMenu(e.text, 1, 99999);
                }, height: 220, html: 'forms/F000003/searchTool_All.html', load: function (e) {

                    e.el.find('.starttime').each(function () {
                        laydate.render({
                            elem: this,
                            trigger: 'click',
                            format: 'yyyy-MM-dd',
                            type: 'datetime',
                            theme: 'molv'
                        });
                    });
                    e.el.find('.endtime').each(function () {
                        laydate.render({
                            elem: this,
                            trigger: 'click',
                            format: 'yyyy-MM-dd',
                            type: 'datetime',
                            theme: 'molv'
                        });
                    });
                    getAssignee_search(e.el, '');

                    e.el.find('#search1').on('click', function () {
                        var week = '';
                        var month = '';
                        var dept = '';
                        var group = '';
                        var starttime = '';
                        var endtime = '';
                        var ownerid = '';
                        if (e.el.find('.week').prop('checked') == true)
                            week = 1;
                        if (e.el.find('.month').prop('checked') == true)
                            month = 1;
                        if (e.el.find('.dept').prop('checked') == true)
                            dept = 1;
                        if (e.el.find('.group').prop('checked') == true)
                            group = 1;
                        if (e.el.find('.starttime').val() != null)
                            starttime = e.el.find('.starttime').val();
                        if (e.el.find('.endtime').val() != null)
                            endtime = e.el.find('.endtime').val();
                        if (e.el.find('.assignee_search').val() != null)
                            ownerid = e.el.find('.assignee_search').val();

                        var search = {
                            userid: me.options.userInfo.id,
                            weekpoint: week,
                            monthpoint: month,
                            ownerid: ownerid,
                            deptpoint: dept,
                            grouppoint: group,
                            starttime: starttime,
                            endtime: endtime,
                            sort: 'id',
                            desc: 'true'
                        };
                        var ps = {

                            index: 1,
                            size: 20,
                            json: iwfTool.encryptByDES(utils.fromJSON(search)),
                            keyword: me.flowbox.find(':input').val(),
                            type: 1,
                            //1我的任务;2我分派;3历史;4全部
                        };
                        var pageConfig = {
                            total: 0,
                            pageSize: 20,
                            pageCount: 0,
                            pageIndex: 1,
                            pageclick: function (pageIndex, pageSize) {
                                LoadMenu('', pageIndex, pageSize);
                            }
                        };


                        $.post(me.rootPath + 'task/view.data', ps, function (js, scope) {
                            me.flowTool.PageBar(pageConfig, js);
                            config.data = js.rows;
                            me.dataGrid = me.flowGrid.iwfGrid(config);
                        }, 'json');

                    });
                }
            }
        );


        me.flowGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(el);

    }

    var toolConfig = {
        data: [{
            title: '新增任务',
            text: '新增任务',
            key: 'mycost_a',
            click: function (e) {
                addTask(e);
            }
        }, {
            title: '任务详情',
            text: '任务详情',
            key: 'mycost_b',
            click: function (e) {
                taskDetail(e);
            }
        }]
    };

    var setting = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: {"Y": "ps", "N": "ps"}
        },
        data: {
            key: {
                title: "text",
                checked: 'checked',
                name: 'cnname'
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: "-1"
            }
        },
        async: {
            enable: true,
            type: "get",
            url: me.rootPath + 'dept/getDeptUserTree.data',
            autoParam: ["id"],
            otherParam: {type: 0, "userid": "zTreeAsyncTest"},
            dataFilter: filter
        },
        callback: {
            onClick: function (e, treeId, treeNode, clickFlag) {
                dropTree.zTree.checkNode(treeNode, !treeNode.checked, true);
            },
            beforeAsync: beforeAsync,
            onAsyncError: onAsyncError,
            onAsyncSuccess: onAsyncSuccess,
            onCollapse: onCollapse,
            onExpand: onExpand
        }
    };

    function filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;
        // var ipArr=[];
        // if(!$.isEmptyObject(ips)){
        // 	ipArr = ips.split(',');
        // }
        for (var i = 0, l = childNodes.length; i < l; i++) {
            if (!childNodes[i].isDept) {
                childNodes[i].icon = 'resources/default/images/user_grid.gif';
                // 	childNodes[i].isParent=true;

                // 	if(ipArr.length>0) {
                // 		childNodes[i].checked=isDefaultChecked(ipArr,childNodes[i].text);//checked, true
                // 	}
                // }else{
                // 	if(ipArr.length>0) {
                // 		childNodes[i].checked=isDefaultChecked(ipArr,childNodes[i].text);//checked, true
                // 	}
            } else {
                childNodes[i].nocheck = true;
                childNodes[i].isParent = true;
            }
        }
        //childNodes=treeData(childNodes);
        return childNodes;
    }

    function isDefaultChecked(arr, v) {
        var isHas = false;
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item == v) {
                isHas = true;
                break;
            }
        }
        return isHas;
    }

    function beforeAsync(treeId, treeNode) {
        showLog("[ " + getTime() + " beforeAsync ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
        return true;
    }

    function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
        showLog("[ " + getTime() + " onAsyncError ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
    }

    function onAsyncSuccess(event, treeId, treeNode, msg) {
        showLog("[ " + getTime() + " onAsyncSuccess ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
    }

    function showLog(str) {

    }

    function onExpand(event, treeId, treeNode) {
        showLog("[ " + getTime() + " onExpand ]&nbsp;&nbsp;&nbsp;&nbsp;" + treeNode.name);
    }

    function onCollapse(event, treeId, treeNode) {
        showLog("[ " + getTime() + " onCollapse ]&nbsp;&nbsp;&nbsp;&nbsp;" + treeNode.name);
    }

    function getTime() {
        var now = new Date(),
            h = now.getHours(),
            m = now.getMinutes(),
            s = now.getSeconds(),
            ms = now.getMilliseconds();
        return (h + ":" + m + ":" + s + " " + ms);
    }

    function treeData(data) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item[setting.data.simpleData.pIdKey] == setting.data.simpleData.rootPId) {
                item.isParent = true;
                item.nocheck = true;
            }
        }
        return data;
    }

    function treeDataIps(data, arr) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item[setting.data.simpleData.pIdKey] == setting.data.simpleData.rootPId) {
                item.isParent = true;
                //item.nocheck=true;
                item.checked = isDefaultChecked(arr, item.text);//checked, true
            }
        }
        return data;
    }

    var dropTree = null;

    function loadDevTypes(el) {
        var url = me.rootPath + 'dept/getDeptUserTree.data';
        var ps = {id: -1, type: 0, userid: '', index: 1, size: 115}
        $.getJSON(url, ps, function (json, scope) {
            var vData = json;
            if (dropTree != null) {
                dropTree.remove();
            }
            vData = treeData(vData);
            var ips = el.val();
            var ipArr = [];
            if (!$.isEmptyObject(ips)) {
                ipArr = ips.split(',');
                vData = treeDataIps(vData, ipArr);
            }
            dropTree = el.dropTree({
                setting: setting, data: vData, height: 250, click: function (e) {
                    if (e.data.ok) {
                        var nodes = dropTree.zTree.getCheckedNodes(true);
                        dealNodes(el, nodes);

                    }
                }
            });

        });
    }

    function loadDevTypesOne(el) {
        var url = me.rootPath + 'dept/getDeptUserTree.data';
        var ps = {id: -1, type: 0, userid: '', index: 1, size: 115}
        $.getJSON(url, ps, function (json, scope) {
            var vData = json;
            if (dropTree != null) {
                dropTree.remove();
            }
            vData = treeData(vData);
            var ips = el.val();
            var ipArr = [];
            if (!$.isEmptyObject(ips)) {
                ipArr = ips.split(',');
                vData = treeDataIps(vData, ipArr);
            }
            dropTree = el.dropTree({
                setting: setting, data: vData, height: 250, click: function (e) {
                    if (e.data.ok) {
                        var nodes = dropTree.zTree.getCheckedNodes(true);
                        dealNodesOne(el, nodes);

                    }
                }
            });

        });
    }

    function loadDeptUserTree(el) {
        el.find('#ownername').on('click', function () {
            loadDevTypesOne($(this));
        });


    }

    function dealNodes(el, nodes) {
        if (nodes.length > 0) {
            var cname = nodes[0].cnname;
            var node = nodes[0].id - 100000;
            if (nodes.length >= 1)
                for (var i = 1; i < nodes.length; i++) {
                    cname = cname + ',' + nodes[i].cnname;
                    node = node + ',' + (nodes[i].id - 100000);
                }
            el.val(cname);
            el.parent().find('#ownerid').val(node);
            el.parent().find('.ownerid').val(node);
        }

    }

    function dealNodesOne(el, nodes) {
        if (nodes.length > 0) {
            var cname = nodes[0].cnname;
            var node = nodes[0].id - 100000;
            el.val(cname);
            el.parent().find('#ownerid').val(node);
            el.parent().find('.ownerid').val(node);
        }

    }

    var assignee = "";

    function getAssignee(el, name, keyword) {
        if (assignee == "") {
            var assignerUrl = me.rootPath + 'user/findbyfullname.data';
            $.ajax({
                async: false,
                cache: false,
                type: 'POST',
                dataType: 'json',
                url: assignerUrl,
                data: {fullname: ''},
                success: function (json) {
                    assignee = json;

                },
                error: function () {
                    $.fn.alert({success: true, msg: '网络连接失败'});
                }
            });

        }

        el.find(name).each(function () {

            if ($(this).val() == null || $(this).val() == "") {
                $(this).empty();
                $(this).append('<option value="">请选择</option>');
                for (var i = 0; i < assignee.length; i++) {
                    $(this).append('<option value="' + assignee[i].username + '">' + assignee[i].fullname + '</option>');
                }

            }
        });

    }

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $(
                '<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>')
                .appendTo(tab.c);
            InitLeftToolbar(temp);
            LoadLitchi('', 1, 20);

        }
        me.execCommand('show', {
            a: args.a
        });

    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {
                    a: args.a
                }) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });


};
