IWF.plugins['allhistask'] = function () {

    var me = this;
    var nav = {
        icon: 'icon-calendar',
        title: '所有任务',
        a: 'allhistask',
        b: 'allhistask',
        index: 3,
        canClose: true
    };


    var setting = {

        view: {
            showLine: false
        },
        data: {
            key: {
                title: "name",
                name: 'autoid'
            },
            simpleData: {
                enable: true,
                pIdKey: 'pid',
                rootPId: 0
            }
        },

    };

    function getCombinArr(arr) {
        var allArr = [];
        var sArr = [];
        for (var i = 0; i < arr.length; i++) {
            var it = arr[i];
            if (i % 2 == 0) {
                allArr.push(it);
            } else {
                sArr.push(it);
            }
        }
        return {a: allArr, b: sArr};
    }

    function renderCisiList(el, o) {
        for (var i = 0; i < o.a.length; i++) {
            var it = o.a[i];
            var itb = o.b[i];
            var groupEl = $('<li></li>').appendTo(el);

            if (it.isPast == 0) {
                var upEl = $('<div class="ciscoUp"></div>').appendTo(groupEl);
            } else {
                var upEl = $('<div class="ciscoUpDisable"></div>').appendTo(groupEl);
            }

            if (itb.isPast == 0) {
                var downEl = $('<div class="ciscoDown"></div>').appendTo(groupEl);
            } else {
                var downEl = $('<div class="ciscoDownDisable"></div>').appendTo(groupEl);
            }


        }
    }


    function renderGrid(el) {


        //url: me.rootPath+'menu/view.data', //请求后台的URL（*）
    }


    var tplBar = '<div class="progress" style="width:100%;margin-top: 9px;background-color: #9f9f9f">'
        + '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="margin-bottom: 6px;width: {proeccess}">'
        + '{proeccess}'
        + '</div>'
        + '</div>';

    var config = {

        changeDate: function (d) {
            return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
        },
        typeZone: function (type) {
            return iwfTool.getVDict(me.ds['deptType'], 'value', type);
            //return (type) ? '[<span style="color:red;">是</span>]' : '[<span style="color:green;">否</span>]';
        },
        getName: function (type) {
            return iwfTool.getVDict(me.ds['costtype'], 'value', type);
        },
        cale: function (p, d) {
            return p;
        },
        columns: [
            {title: '编号', text: '{autoid}', width: '15%', sortable: true},
            {title: '级别', text: '{levels}', width: '4%'},
            {title: '任务标题', text: '{name}', width: '8%'},
            {title: '任务内容', text: '{remark}', width: '13%'},
            {title: '下发人', text: '{openid}', width: '8%'},
            {title: '当前处理人', text: '{manager}', width: '8%'},
            {title: '计划完成时间', text: '{plan_endtime}', width: '13%', sortable: true},
            {title: '任务状态', text: '{status}', width: '8%'},
            {title: '完成进度', text: tplBar, width: '10%', sortable: true},
            {
                title: '操作',
                text: '<a level="2010" href="javascript:void(0)"><span class="label label-info" style="line-height: initial;width:60px" > 任务详细   </span></a>',
                width: '12%'
            }
        ],
        linkclick: function (sender, data) {
            //var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            var level = $(this).attr("level");
            if (level == 2010) {
                //showRoleMenu(data.id);var This = {};
                var This = {};
                This.id = sender.data.id;
                This.username = me.options.userInfo.id;
                var data1 = {
                    icon: 'icon-sitemap',
                    color: 'icon-red',
                    'a': 'taskdetail',
                    'b': 'taskdetail',
                    params: This
                };
                var meTaskDetail = window.framework;
                meTaskDetail.execCommand('go', data1);
            }
            if (level == 2011) {
                //showUsers(data.id);
            }
        }, sort: function (index, col, isDesc) {
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
                userid: '',
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
                type: 4
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
    };

    function collectionParams() {

        // var a = me.options.userInfo.username;
        // return {userid:me.options.userInfo.username};user_id
        return {
            userid: '',
            weekpoint: 0,
            monthpoint: 0,
            deptpoint: 0,
            grouppoint: 0,
            ownerid: "",
            starttime: "",
            endtime: "",
            sort: 'id',
            desc: 'true'
        };
        //return {id:"19",proeccess:90};
        //return [{id:"",proeccess:80,name:"TEST--2",openid:"1",ownerid:"2",pid:23,rate:50},{id:"",proeccess:80,name:"TEST--2",openid:"1",ownerid:"2",pid:23,rate:50}];
        //	return {mainTask:{id:"",proeccess:80,name:"TEST--2",openid:"1",ownerid:"2",pid:23,rate:50},assignTask:[{}]};
    }

    function LoadMenu(keyword, index, size) {
        var ps = {

            index: index,
            size: size,
            keyword: keyword,
            json: utils.fromJSON(collectionParams()),
            type: 4 //1我的任务;2我分派;3历史;4全部
        };
        var pageConfig = {
            total: 0,
            pageSize: 99999,
            pageCount: 0,
            pageIndex: 1,
            pageclick: function (pageIndex, pageSize) {
                LoadMenu('', pageIndex, pageSize);
            }
        };

        /*
         $.getJSON(me.rootPath+'task/view.data', ps, function (js, scope) {
         //var js={data:[],pageSize:20,pageCount:123,pageIndex:1,pageCount:23,total:1243}
         me.flowTool.PageBar(pageConfig,js);
         //    config.data=js.data;
         //    me.litchiGrid=me.gridEl.iwfGrid(config);

         me.dataGrid=me.ztreeEl.iTreeTable({setting:setting,data:js.rows,config:config});
         me.dataGrid.expandAll(true);
         });
         */
        $.post(me.rootPath + 'task/view.data', ps, function (js, scope) {
            //me.flowTool.PageBar(pageConfig,js);
            me.dataGrid = me.ztreeEl.iTreeTable({setting: setting, data: js.rows, config: config});
            me.dataGrid.expandAll(false);


        }, 'json');
    }

    function LoadLitchi(keyword, index, size) {

        var ps = {

            index: index,
            size: size,
            keyword: keyword,
            json: iwfTool.encryptByDES(utils.fromJSON(collectionParams())),
            type: 4
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
            }

            , 'json');
    }

    function SearchMenu(keyword) {
        //if(utils.isEmptyObject(keyword)){
        //   return;
        // }

        var treeObj = me.dataGrid;//$.fn.zTree.getZTreeObj("tree-obj");
        //var keywords=$("#keyword").val();
        LoadMenu(keyword, 1, 9999);
        //var nodes = treeObj.getNodesByParamFuzzy("manager", keyword, null);
        //if (nodes.length>0) {
        //    treeObj.selectNode(nodes[0]);
        //}
    }


    function taskDetail(e) {

        //var arr = me.winDataGrid.getSelected();
        var arr = me.dataGrid.getSelectedNodes();

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
        //	me.flowTool.empty();
        var This = {};
        This.id = arr[0].id;
        This.username = me.options.userInfo.id;
        var data = {icon: 'icon-sitemap', color: 'icon-red', 'a': 'taskdetail', 'b': 'taskdetail', params: This};
        var meTaskDetail = window.framework;
        meTaskDetail.execCommand('go', data);
    }

    /*
     var toolConfig = {
     data : [ {
     title : '任务详情',
     text : '任务详情',
     key : 'mycost_b',
     click : function(e) {
     taskDetail(e);
     }
     } ]
     };

     function InitLeftToolbar(el) {
     el.empty();
     me.searchTool = $('<div style="width:100%;float:left;margin-top: 10px;" ></div>').appendTo(el);
     me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

     me.flowTool.ToolBar(toolConfig);

     me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);
     me.flowbox = me.flowform.iBox({layout:'right', click : function(e) {
     LoadLitchi(e.text, 1, 20);
     },height:220,html:'forms/F000001/SystemSet_Ad.html',load:function(e){

     } });
     me.flowGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(el);

     }*/
    function InitLeftToolbar(el) {
        el.empty();
        //me.flowTool = $('<div style="width:100%;float:left;margin-top: 10px;" ></div>').appendTo(el);
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        //me.flowTool.ToolBar(toolConfig);

        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);
        /*  */
        /*
         me.flowbox = me.flowform.iBox({layout:'right', click : function(e) {
         SearchMenu(e.text, 1, 99999);
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
                    getAssignee(e.el, '');

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
                            userid: '',
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
                            type: 4,
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
                            //me.flowTool.PageBar(pageConfig,js);
                            me.dataGrid = me.ztreeEl.iTreeTable({setting: setting, data: js.rows, config: config});
                            me.dataGrid.expandAll(false);
                        }, 'json');

                    });


                }
            }
        );


        me.flowGrid = $('<div class="iTreeTable" style="width:100%;float:left;background: white;" ></div>').appendTo(el);
        var data = [{
            "id": "20170525091439001010",
            "name": "企业注册",
            "pId": null,
            "status": "1",
            "typecode": "02"
        }, {
            "id": "20170724174119005610",
            "name": "部门沟通演练",
            "pId": "20170525091439001010",
            "status": "1",
            "typecode": "2"
        }, {
            "id": "20170725085455000110",
            "name": "测试12",
            "pId": null,
            "status": "1",
            "typecode": "11"
        }, {
            "id": "20170731171011000410",
            "name": "审批流程",
            "pId": null,
            "status": "1",
            "typecode": "222"
        }, {
            "id": "20170803133941018010",
            "name": "单位登记",
            "pId": null,
            "status": "1",
            "typecode": "188"
        }, {
            "id": "20170804085419000110",
            "name": "模拟",
            "pId": null,
            "status": "1",
            "typecode": "122"
        }, {
            "id": "20170809090321000110",
            "name": "审批模拟（新）测试测试测试测试测试",
            "pId": "20170525091439001010",
            "status": "1",
            "typecode": "110"
        }, {
            "id": "20170809105407009210",
            "name": "测测测测测测测测测测测测测测测测测测",
            "pId": "20170809090321000110",
            "status": "1",
            "typecode": "123"
        }, {
            "id": "20170814183837000210",
            "name": "企业登记",
            "pId": null,
            "status": "1",
            "typecode": "111"
        }, {
            "id": "20170822183437000710",
            "name": "单事项-部门沟通",
            "pId": "20170814183837000210",
            "status": "1",
            "typecode": "822"
        }, {
            "id": "20170922112245000510",
            "name": "23",
            "pId": null,
            "status": "1",
            "typecode": "03"
        }, {
            "id": "20170922143810000010",
            "name": "sdfa",
            "pId": null,
            "status": "1",
            "typecode": "04"
        }, {
            "id": "20170922145203000110",
            "name": "64526",
            "pId": null,
            "status": "1",
            "typecode": "34262"
        }, {
            "id": "20170922155403001610",
            "name": "333",
            "pId": null,
            "status": "1",
            "typecode": "33354"
        }, {
            "id": "20170922171750000210",
            "name": "4441234",
            "pId": null,
            "status": "1",
            "typecode": "44444"
        }, {
            "id": "20170925160636007410",
            "name": "测试数据",
            "pId": "20170731171011000410",
            "status": "1",
            "typecode": "231"
        }, {
            "id": "20170925163306007510",
            "name": "23462111",
            "pId": null,
            "status": "1",
            "typecode": "2345"
        }, {
            "id": "20170925163959007610",
            "name": "242345",
            "pId": "20170922112245000510",
            "status": "1",
            "typecode": "3625346"
        }];
        me.ztreeEl = $('<ul class="ztree" style="width:100%;height:100%"></ul>').appendTo(me.flowGrid);


    }

    function GetDataSource() {
        me.ds = {};
        me.ds['deptType'] = [{cnname: '部门', value: 0}, {cnname: '机构', value: 1}];
    }

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {

            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);
            InitLeftToolbar(temp);

            LoadMenu('', 1, 99999);
            GetDataSource();
            //var mainEl = $('<div class="mainban"></div>').appendTo(temp);
            //var liGroupEl = $('<ul></ul>').appendTo(temp);
            var arr = [{title: 'xx', isPast: 0}, {title: 'xx', isPast: 1}, {title: 'xx', isPast: 1}, {
                title: 'xx',
                isPast: 0
            }];
            var o = getCombinArr(arr);
            //renderCisiList(liGroupEl, o);

            var gridRoot = $('<div class="row no-padding" style="margin:0px 10px;"></div>').appendTo(tab.c);
            var leftRoot = $('<div class="col-xs-3 col-md-3" style="padding: 0px 15px 0px 0px;"></div>').appendTo(gridRoot);
            var rightRoot = $('<div class="col-xs-9 col-md-9 no-padding"></div>').appendTo(gridRoot);

        }
        me.execCommand('show', {a: args.a});

    }


    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {
                    a: args.a
                }) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });


    function getAssignee(el, name, keyword) {
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

    function getJson(id) {
        var result = {};

        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: me.rootPath + 'task/getLevel.data',
            data: {id: iwfTool.encryptByDES(id), username: iwfTool.encryptByDES(me.options.userInfo.id)},
            success: function (json) {
                json = $.parseJSON(json);
                result = json;

            },
            error: function () {
                $.fn.alert({success: true, msg: '网络连接失败'});
            }
        });

        return result;
    }

};
