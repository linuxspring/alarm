IWF.plugins['importtask'] = function () {

    var me = this;
    var nav = {
        icon: 'icon-calendar',
        title: '任务库',
        a: 'importtask',
        b: 'importtask',
        index: 3,
        canClose: true
    };
    var tplBar = '<div class="progress" style="width:80px;margin-bottom: 0px;background-color: #9f9f9f">'
        + '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: {proeccess}">'
        + '<span >{proeccess}</span>'
        + '</div>'
        + '</div>';
    var config = {
        typeZone: function (type) {
            return (type == 0) ? '<a level="2010" href="javascript:void(0)"><span class="label label-info" style="line-height: initial;width:60px">领用   </span></a>' : '<a level="2010" href="javascript:void(0)"><span class="label label-info" style="line-height: initial;width:60px;background:#9f9f9f">已领用</span></a>';
        },
        userZone: function (type) {
            return (type == '未领取') ? '<img src="resources/default/images/u1215.png" height="15" width="15" alt="" style="vertical-align:middle;">' : '<span style="color:black;">' + type + '</span>';
        },
        columns: [{
            title: '<input type="checkbox" />',
            text: '<input type="checkbox" />',
            width: '3%',
            click: true
        }, {
            title: '编号',
            text: '{AUTOID}',
            width: '10%',
            sortable: true
        }, {
            title: '任务标题',
            text: '{NAME}',
            width: '15%'
        }, {
            title: '任务内容',
            text: '{REMARK}',
            width: '20%'
        }, {
            title: '完成进度',
            text: tplBar,
            width: '10%',
            sortable: true
        }, {
            title: '<div style="vertical-align:middle;text-align: center">主要负责人</div>',
            text: '<div style="vertical-align:middle;text-align: center">{userZone(MANAGER)}</div>',
            width: '15%'
        }, {
            title: '操作',
            text: '{typeZone(STATUS)}',
            width: '12%'
        },

        ],
        linkclick: function (sender, data) {
            //var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            //LoadEpInfo(data);
            //GetGoodsByEpId(me.epItemListEl, 1, 25, data);
            if (data.STATUS == 0)
                addTask(data);
        }, sort: function (index, col, isDesc) {
            var sort = 'id';
            switch (index) {
                case 1:
                    sort = 'id';
                    break;

                case 4:
                    sort = 'proeccess';
                    break;
                default:
                    'id';
            }
            var search = {
                userid: me.options.userInfo.id,
                sort: sort,
                desc: isDesc
            };
            var ps = {

                index: 1,
                size: 20,
                keyword: me.flowbox.find(':input').val(),
                json: utils.fromJSON(search),

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

            $.post(me.rootPath + 'task/storeview.data', ps, function (js, scope) {
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
            sort: 'id',
            desc: 'true'
        };
    }


    function importtask(e) {

        me.pnl = me.flowGrid.Form({
            html: 'forms/F000003/importTask.html',
            title: '上传',
            load: function (e) {
                me.flowTool.empty();

            },
            click: function (e) {

                InitLeftToolbar(me.flowTool.parent());
                LoadLitchi('', 1, 20);
            }
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

    //领用
    function addTask(e1) {
        var arr = me.dataGrid.getSelected();


        /* var arr=[];
         for(var i=0;i<rows.length;i++){
         arr.push(rows[i].id);
         }*/
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        } else if (arr.length > 1) {
            return $.fn.alert({success: true, msg: '只能选择一条记录'});
        }
        if (arr[0].STATUS > 0) {
            return $.fn.alert({success: true, msg: '请不要重复领用'});
        }


        var This = {};
        me.flowTool.empty();
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000003/addTask.html',
            title: '新建任务',
            load: function (e) {
                loadDeptUserTree(e);
                e.find('#name').val(arr[0].NAME);
                e.find('#remark').val(arr[0].REMARK);
                e.find('#ownerid').val(arr[0].OWNERID);
                e.find('#ownername').val(arr[0].MANAGER);
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
                    mainTask.storeid = arr[0].ID;
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

    //逻辑删除
    function Del() {
        var rows = me.dataGrid.getSelected();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].ID);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        var ids = arr.join(',');
        var tpl = '<h4>你确定要删除[' + arr.length + ']条记录吗?</h4>';
        $('body').Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'task/logicaldel.data', {ids: iwfTool.encryptByDES(ids)}, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            LoadLitchi('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function Download() {
        window.open(me.rootPath + "file/model.xls");

    }

    function LoadLitchi(keyword, index, size) {
        var ps = {

            index: index,
            size: size,
            keyword: keyword,
            json: utils.fromJSON(collectionParams()),

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

        $.post(me.rootPath + 'task/storeview.data', ps, function (js, scope) {
            me.flowTool.PageBar(pageConfig, js);
            config.data = js.rows;
            me.dataGrid = me.flowGrid.iwfGrid(config);
        }, 'json');
    }

    function GetDataSource() {
        me.ds = {};
        var pid = "";
        var statusPid = "";
        var pidnum = 0;
        var statusnum = 0;
        //先循环，找到PID，在循环，找到子项
        for (var i = 0; i < me.options.dict.length; i++) {
            if (me.options.dict[i].enname == 'store_status') {
                statusPid = me.options.dict[i].id;
                statusnum = 1;
                break;
            }

        }

        me.ds['store_status'] = iwfTool.getDict(me.options.dict, 'pid', statusPid);
        //me.ds['sex']=[{cnname:'男',value:0},{cnname:'女',value:1}]
    }


    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);
        me.flowTool.ToolBar(toolConfig);
        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);
        me.flowbox = me.flowform.iBox({
            layout: 'right', click: function (e) {
                LoadLitchi(e.text, 1, 20);
            }, height: 220, html: 'forms/F000001/SystemSet_Ad.html', load: function (e) {

            }
        });

        me.flowGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(el);

    }

    var toolConfig = {
        data: [{
            title: '导入',
            text: '导入',
            key: 'mycost_a',
            click: function (e) {
                importtask(e);
            }
        }, {
            title: '领用',
            text: '领用',
            key: 'mycost_a',
            click: function (e) {
                addTask(e);
            }
        }, {
            title: '下载模版',
            text: '下载模版',
            key: 'mycost_a',
            click: function (e) {
                Download();
            }
        }, {
            title: '删除',
            text: '删除',
            key: 'mycost_a',
            click: function (e) {
                Del();
            }
        }
        ]
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
            GetDataSource();
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
