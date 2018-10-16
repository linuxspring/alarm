IWF.plugins['todotask'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '我的待办任务', a: 'todotask', b: 'todotask', index: 3, canClose: false};
    me.addListener('init', function () {
        me.execCommand('addtab', nav);
    });

    me.addListener('initurl', function () {
        me.execCommand('go', nav);
    });
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
            title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '3%', click: true
        },
            {
                title: '<img height="15" width="15" src="resources/default/images/yuan.png" alt="" />' + ' ' + '编号',
                text: '<div style="vertical-align:middle;">{getYuan(status)}' + '<span style="height: 100%;vertical-align: middle;display: inline-block">{autoid}</span></div>',
                width: '10%',
                sortable: true
            },

            {title: '级别', text: '{levels}', width: '5%'},
            {title: '任务标题', text: '{name}', width: '10%'},
            {title: '任务内容', text: '{remark}', width: '12%'},
            {title: '下发人', text: '{openid}', width: '8%'},
            {title: '主要负责人', text: '{manager}', width: '8%'},
            {title: '计划完成时间', text: '{plan_endtime}', width: '15%', sortable: true},
            {title: '任务状态', text: '{status}', width: '7%'},
            {title: '完成进度', text: tplBar, width: '13%', sortable: true}

        ],

        linkclick: function (sender, data) {
            var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            //LoadEpInfo(data);
            GetGoodsByEpId(me.epItemListEl, 1, 25, data);
        },
        sort: function (index, col, isDesc) {
            //alert(index+','+col+','+isDesc);
            //LoadLitchi('', 1, 20);
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
                case 7:
                    sort = 'plan_endtime';
                    break;
                case 9:
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
            if ($('#assignee_search').val() != null)
                ownerid = $('#assignee_search').val();


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

    function getAssignee(el, name, keyword) {
        var assignerUrl = me.rootPath + 'user/findbyfullname.data';

        $.post(assignerUrl, {
            fullname: ''
        }, function (json, scope) {

            var data = json;
            el.find('#assignee').empty();
            el.find('#assignee').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                el.find('#assignee').append(
                    '<option value="' + data[i].id + '">'
                    + data[i].fullname + '</option>');
            }

        }, 'json');
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


    function changeJinDu(e) {
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

        var This = {};
        This.id = arr[0].id;
        if (me.options.userInfo.id != arr[0].ownerid) {

            return $.fn.alert({success: true, msg: '非当前处理人'});
        }
        var canXiaFa = checkXiaFa(arr[0].id);

        if (!canXiaFa) {
            return $.fn.alert({success: true, msg: '已下发过的无需填写进度！'});
        }
        me.flowTool.empty();
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000003/addJinDu.html', title: '任务进度', load: function (e) {


                var thisProcess = arr[0].proeccess == null ? 0 : parseInt(arr[0].proeccess);
                e.find('#process').val(thisProcess);
                e.find('#comments').val(arr[0].comments);

                //me.unitCmb = e.find('#unit').ComboBox({ data : me.ds['unit'], field : 'cnname', value : 'value', name : '选择单位类型' });
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    var thisProcess = el.find('#process').val();
                    if (!$.isNumeric(thisProcess) || thisProcess < 0 || thisProcess > 100) {
                        return $.fn.alert({success: true, msg: '进度非数字或者大于100！'});
                    }
                    This.process = thisProcess;
                    This.comments = el.find('#comments').val();

                    $.post(me.rootPath + 'task/changeTask.data', {json: utils.fromJSON(This)}, function (json, scope) {
                        if (json.success) {
                            InitLeftToolbar(me.flowTool.parent());
                            LoadLitchi('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    }, 'json');
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadLitchi('', 1, 20);
                }
            }
        });
    }

    function Download() {
        window.open(me.rootPath + "file/model_task.xls");

    }

    function checkXiaFa(id) {
        var result = false;

        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: me.rootPath + 'task/assignTag.data',
            data: {id: id},
            success: function (json) {
                json = $.parseJSON(json);

                if (json.success) {

                    result = json.success;

                }
            },
            error: function () {
                $.fn.alert({success: true, msg: '网络连接失败'});
            }
        });

        return result;
    }

    function checkOwner(fullname) {
        var result = null;

        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: me.rootPath + 'user/findbyfullnameOne.data',
            data: {fullname: fullname},
            success: function (json) {

                result = json;


            },
            error: function () {
                $.fn.alert({success: true, msg: '网络连接失败'});
            }
        });

        return result;
    }

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

            el.parent().find('.ownerid').val(node);
        }

    }

    function xiaFaTask(e) {
        var arr = me.dataGrid.getSelected();

        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        } else if (arr.length > 1) {
            return $.fn.alert({success: true, msg: '只能选择一条记录'});
        }

        //下发过的不过再下发。
        var canXiaFa = checkXiaFa(arr[0].id);

        if (!canXiaFa) {
            return $.fn.alert({success: true, msg: '已下发过，无需再次下发'});
        }


        me.flowTool.empty();
        var This = {};


        me.pnl = me.flowGrid.Form({
            html: 'forms/F000003/addSubTask.html', title: '下发任务', load: function (e) {
                e.find('.ownername').on('click', function () {
                    loadDevTypes($(this));
                });
                e.find('.comments').val(arr[0].remark);
                //获得需要添加的重复行的html。
                var subTaskHtml = e.find('.sub_task').prop("outerHTML");
                $('input[name="import"]').change(function () {
                    //$("#demo").hide();
                    //alert( "val"+$("#demo").val());

                    var wb;//读取完成的数据
                    var rABS = false; //是否将文件读取为二进制字符串
                    importf(this);
                    function importf(obj) {

                        if (!obj.files) {
                            return;
                        }
                        var f = obj.files[0];
                        var reader = new FileReader();
                        reader.onload = function (e1) {
                            var data = e1.target.result;
                            var datas = {};//导入
                            if (rABS) {
                                wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                                    type: 'base64'
                                });
                            } else {
                                wb = XLSX.read(data, {
                                    type: 'binary'
                                });
                            }
                            //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                            //wb.Sheets[Sheet名]获取第一个Sheet的数据
                            //document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
                            //$("#demo").text(JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) ));
                            datas = eval(JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])));
                            e.find('.sub_task').remove();
                            for (var i = 0; i < datas.length; i++) {
                                var oneSubTask = $(subTaskHtml).insertBefore(".otherItem");
                                oneSubTask.find('.comments').val(datas[i].任务内容);
                                oneSubTask.find('.rate').val(datas[i].占比 * 100);
                                oneSubTask.find('.ownername').val(datas[i].负责人);
                                oneSubTask.find('.plan_endtime').each(function () {
                                    laydate.render({
                                        elem: this,
                                        trigger: 'click',
                                        format: 'yyyy-MM-dd HH:mm:ss',
                                        type: 'datetime',
                                        theme: 'molv',
                                        min: new Date().getTime(),
                                        value: convertDateFromString(datas[i].完成时间)
                                    });
                                });
                                oneSubTask.find('.ownername').on('click', function () {
                                    loadDevTypes($(this));
                                });


                            }


                        };


                        if (rABS) {
                            reader.readAsArrayBuffer(f);
                        } else {
                            reader.readAsBinaryString(f);
                        }
                    }

                    function convertDateFromString(dateString) {
                        if (dateString) {
                            var arr1 = dateString.split(" ");
                            var sdate = arr1[0].split('-');
                            var date = new Date(sdate[0], sdate[1] - 1, sdate[2]);
                            return date;
                        }
                    }

                    function fixdata(data) { //文件流转BinaryString
                        var o = "",
                            l = 0,
                            w = 10240;
                        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                        return o;
                    }

                });


                e.find('#addLine').on('click', function () {

                    //$(this).parent().before(subTaskHtml);
                    var oneSubTask = $(subTaskHtml).insertBefore($(this).parent());
                    //    getAssignee(oneSubTask,'.ownerid','');

                    oneSubTask.find('.ownername').on('click', function () {
                        loadDevTypes($(this));
                    });
                    oneSubTask.find('.comments').val(arr[0].remark);

                    oneSubTask.find('.plan_endtime').each(function () {
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

                    oneSubTask.find('.close').on('click', function () {
                        $(this).parent().remove();
                    });


                });

                e.find('.plan_endtime').each(function () {
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

                e.find('.close').on('click', function () {
                    $(this).parent().remove();
                });


                //me.unitCmb = e.find('#unit').ComboBox({ data : me.ds['unit'], field : 'cnname', value : 'value', name : '选择单位类型' });
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    var owneridArr = el.find('.ownerid');
                    var ownernameArr = el.find('.ownername');
                    var rateArr = el.find('.rate');
                    var plan_endtimeArr = el.find('.plan_endtime');
                    var commentsArr = el.find('.comments');
                    for (var i = 0; i < ownernameArr.length; i++) {
                        if (owneridArr[i].value == null || owneridArr[i].value == '') {
                            owneridArr[i].value = checkOwner(ownernameArr[i].value);
                            if (owneridArr[i].value == null || owneridArr[i].value == '') {
                                return $.fn.alert({success: true, msg: '请从新选择' + (i + 1) + '位负责人!,原因:查无此人'});
                                break;
                            }
                        }
                    }


                    var needArr = [];

                    var rateCheck = 0;

                    if (owneridArr.length <= 0) return $.fn.alert({success: true, msg: '请填写负责人！'});
                    for (var i = 0; i < owneridArr.length; i++) {

                        if (!$.isNumeric(rateArr[i].value)) {
                            return $.fn.alert({success: true, msg: '占比非数字！'});
                        }

                        if (!plan_endtimeArr[i].value) {
                            return $.fn.alert({success: true, msg: '请填写完成时间！'});

                        }

                        if (!owneridArr[i].value) {
                            return $.fn.alert({success: true, msg: '请填写负责人！'});
                        }

                        needArr[i] = {
                            pid: arr[0].id, ownerid: owneridArr[i].value,
                            rate: rateArr[i].value, plan_endtime: plan_endtimeArr[i].value,
                            remark: commentsArr[i].value,
                            openid: me.options.userInfo.id
                        };

                        rateCheck = rateCheck + Number(rateArr[i].value);
                    }

                    if (rateCheck != 100) {
                        return $.fn.alert({success: true, msg: '下发后占比总和必须为100！'});
                    }

                    This = needArr;

                    $.post(me.rootPath + 'task/assign.data', {json: utils.fromJSON(This)}, function (json, scope) {
                        if (json.success) {
                            InitLeftToolbar(me.flowTool.parent());
                            LoadLitchi('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
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
            type: 1 //1我的任务;2我分派;3历史;4全部
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
        /*
         me.flowbox = me.flowform.iBox({layout:'right', click : function(e) {
         LoadLitchi(e.text, 1, 20);
         },height:220,html:'forms/F000001/SystemSet_Ad.html',load:function(e){

         } });
         */
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

    function editTask(e) {

        me.flowTool.empty();
        var Task = {};
        var arr = me.dataGrid.getSelected();

        me.pnl = me.flowGrid.Form({
            html: 'forms/F000003/editTask.html',
            title: '编辑任务',
            load: function (e) {
                //loadDeptUserTree(e);
                //e.find('#ownerid').val(me.options.userInfo.id);
                e.find('#ownername').val(arr[0].manager);
                if (arr[0].type == '0') {
                    arr[0].type = '非周期任务';
                } else {
                    arr[0].type = '周期任务';
                }
                e.find('#type').val(arr[0].type);
                e.find('#name').val(arr[0].name);
                e.find('#remark').val(arr[0].remark);
                if (arr[0].weekpoint == '1') e.find('#weekpoint').prop('checked', true);
                if (arr[0].monthpoint == '1') e.find('#monthpoint').prop('checked', true);
                if (arr[0].deptpoint == '1') e.find('#deptpoint').prop('checked', true);
                if (arr[0].grouppoint == '1') e.find('#grouppoint').prop('checked', true);
                fzqBindEvent(e, 0);

            },
            click: function (e) {
                if (e.data.ok) {

                    var el = me.pnl;

                    Task.weekpoint = el.find('#weekpoint').prop('checked') ? 1 : 0;
                    Task.monthpoint = el.find('#monthpoint').prop('checked') ? 1 : 0;
                    Task.deptpoint = el.find('#deptpoint').prop('checked') ? 1 : 0;
                    Task.grouppoint = el.find('#grouppoint').prop('checked') ? 1 : 0;
                    Task.plan_endtime = el.find('#plan_endtime').val();
                    Task.name = el.find('#name').val();
                    Task.remark = el.find('#remark').val();
                    Task.openid = me.options.userInfo.id;
                    Task.openname = me.options.userInfo.fullname;

                    Task.old_weekpoint = arr[0].weekpoint;
                    Task.old_monthpoint = arr[0].monthpoint;
                    Task.old_deptpoint = arr[0].deptpoint;
                    Task.old_grouppoint = arr[0].grouppoint;
                    Task.old_plan_endtime = arr[0].plan_endtime;
                    Task.old_name = arr[0].name;
                    Task.old_remark = arr[0].remark;
                    Task.prjid = arr[0].id;
                    Task.taskautoid = arr[0].autoid;


                    if (!Task.plan_endtime)
                        return $.fn.alert({success: true, msg: '请填写时间节点'});
                    if (!Task.name)
                        return $.fn.alert({success: true, msg: '请填写任务标题'});
                    if (!Task.remark)
                        return $.fn.alert({success: true, msg: '请填写任务内容'});


                    $.post(me.rootPath + 'task/openappr.data', {
                        json: utils.fromJSON(Task)
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


    var toolConfig = {
        data: [
            {
                title: '填写任务进度', text: '填写任务进度', key: 'mycost_a', click: function (e) {
                changeJinDu(e);
            }
            },
            {
                title: '下发任务', text: '下发任务', key: 'mycost_copy', click: function (e) {
                xiaFaTask(e, 1);
            }
            },
            {
                title: '编辑', text: '编辑任务', key: 'mycost_copy', click: function (e) {
                editTask(e);
            }
            },
            {
                title: '下载模版', text: '下载模版', key: 'mycost_a', click: function (e) {
                Download();
            }
            }
        ]
    };

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);

            InitLeftToolbar(temp);
            LoadLitchi('', 1, 20);


        }
        me.execCommand('show', {a: args.a});

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

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });
};
