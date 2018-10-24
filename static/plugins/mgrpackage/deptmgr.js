IWF.plugins['deptmgr'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '组织机构', a: 'deptmgr', b: 'deptmgr', index: 3, canClose: true};
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
                rootPId: -1
            }
        }
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


    function addMenu(e) {
        var rows = me.dataGrid.getSelectedNodes();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }

        me.flowTool.empty();
        var This = {};
        if (arr.length == 0) {
            This.pid = -1;
        } else {
            This.pid = arr[0];
        }
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/addDept.html', title: '新增部门', load: function (e) {
                me.deptTypeCmb = e.find('#dept_type').ComboBox({
                    data: me.ds['deptType'],
                    field: 'cnname',
                    value: 'value',
                    name: '选择性别类型'
                });
                me.deptTypeCmb.setValue(me.ds['deptType'][0]['cnname']);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.deptName = el.find('#deptname').val();
                    This.tel = el.find('#tel').val();
                    This.dept_type = me.deptTypeCmb.getValue('value');// el.find('#dept_type').val();
                    This.manager = el.find('#manager').val();
                    This.description = el.find('#remark').val();
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'dept/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    LoadMenu('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadMenu('', 1, 25);
                }
            }
        });
    }


    function DelMenu(e) {
        var rows = me.dataGrid.getSelectedNodes();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        if (rows[0].children) {
            if (rows[0].children.length > 0)
                return $.fn.alert({success: true, msg: '有子部门，不允许删除'});
        }
        var ids = arr.join(',');
        var tpl = '<h4>你确定要删除[' + arr.length + ']条记录吗?</h4>';
        $('body').Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'dept/del.data', {ids: ids, sid: me.sid, type: 1}, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            LoadMenu('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function ModifyMenu() {
        var rows = me.dataGrid.getSelectedNodes();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        me.flowTool.empty();
        var This = {};
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/addDept.html', title: '修改部门', load: function (e) {
                me.deptTypeCmb = e.find('#dept_type').ComboBox({
                    data: me.ds['deptType'],
                    field: 'cnname',
                    value: 'value',
                    name: '选择性别类型'
                });
                me.deptTypeCmb.setValue(iwfTool.getVDict(me.ds['deptType'], 'value', rows[0]['dept_type']));
                e.find('#deptname').val(rows[0].deptName);
                e.find('#tel').val(rows[0].tel);
                //e.find('#dept_type').val(rows[0].dept_type);
                e.find('#manager').val(rows[0].manager);
                e.find('#remark').val(rows[0].description);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.id = rows[0].id;
                    This.deptName = el.find('#deptname').val();
                    This.tel = el.find('#tel').val();
                    This.dept_type = me.deptTypeCmb.getValue('value');// el.find('#dept_type').val();
                    This.manager = el.find('#manager').val();
                    This.description = el.find('#remark').val();
                    This.pid = -1;
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'dept/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    LoadMenu('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadMenu('', 1, 25);
                }
            }
        });
    }

    function CopyMenu() {
        var rows = me.dataGrid.getSelectedNodes();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        me.flowTool.empty();
        var This = {};
        if (arr.length == 0) {
            This.pid = -1;
        } else {
            This.pid = arr[0];
        }
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/addDept.html', title: '复制并新增部门', load: function (e) {
                me.deptTypeCmb = e.find('#dept_type').ComboBox({
                    data: me.ds['deptType'],
                    field: 'cnname',
                    value: 'value',
                    name: '选择性别类型'
                });
                me.deptTypeCmb.setValue(iwfTool.getVDict(me.ds['deptType'], 'value', rows[0]['dept_type']));
                e.find('#deptname').val(rows[0].deptName);
                e.find('#tel').val(rows[0].tel);
                //e.find('#dept_type').val(rows[0].dept_type);
                e.find('#manager').val(rows[0].manager);
                e.find('#remark').val(rows[0].description);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.deptName = el.find('#deptname').val();
                    This.tel = el.find('#tel').val();
                    This.dept_type = me.deptTypeCmb.getValue('value');// el.find('#dept_type').val();
                    This.manager = el.find('#manager').val();
                    This.description = el.find('#remark').val();
                    This.pid = -1;
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'dept/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    LoadMenu('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadMenu('', 1, 25);
                }
            }
        });
    }

    function DetailMenu() {
        var rows = me.dataGrid.getSelectedNodes();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        me.flowTool.empty();
        var This = rows[0];
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/detailDept.html', title: '部门详细信息', load: function (el) {
                var tpl = el.html();
                el.empty();
                $(utils.replaceTpl(tpl, This)).appendTo(el);
            }, click: function (e) {
                InitLeftToolbar(me.flowTool.parent());
                LoadMenu('', 1, 25);
            }
        });
    }

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
            {title: '编号', text: '{autoid}', width: '30%'}
            , {title: '部门', text: '{dept_name}', width: '15%'}
            , {title: '电话', text: '{tel}', width: '10%'}
            , {title: '类型', text: '{typeZone(dept_type)}', width: '10%'}
            , {title: '创建时间', text: '{changeDate(createtime)}', width: '15%'}
            , {title: '描述', text: '{description}', width: '20%'}
        ]
    }

    function SearchMenu(keyword) {
        if (utils.isEmptyObject(keyword)) {
            return;
        }

        var treeObj = me.dataGrid;//$.fn.zTree.getZTreeObj("tree-obj");
        //var keywords=$("#keyword").val();
        var nodes = treeObj.getNodesByParamFuzzy("name", keyword, null);
        if (nodes.length > 0) {
            treeObj.selectNode(nodes[0]);
        }
    }

    function LoadMenu(keyword, index, size) {
        var ps = {
            keyword: keyword || '',
            isDeleted: 0,
            type: 0,
            fromdate: '',
            todate: '',
            userid: me.options.userInfo.id,
            index: index,
            size: size
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

        $.getJSON(me.rootPath + 'dept/view.data', ps, function (js, scope) {
            //var js={data:[],pageSize:20,pageCount:123,pageIndex:1,pageCount:23,total:1243}
            me.flowTool.PageBar(pageConfig, js);
            //    config.data=js.data;
            //    me.litchiGrid=me.gridEl.iwfGrid(config);

            me.dataGrid = me.ztreeEl.iTreeTable({setting: setting, data: js.rows, config: config});
            me.dataGrid.expandAll(true);
        });
    }

    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        me.flowTool.ToolBar(toolConfig);

        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);

        me.flowbox = me.flowform.iBox({
            layout: 'right', click: function (e) {
                SearchMenu(e.text, 1, 20);
            }, height: 220, html: 'forms/F000001/SystemSet_Ad.html', load: function (e) {

            }
        });

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

    var toolConfig = {
        data: [
            {
                title: '新增部门', text: '新增', key: 'mycost_a', click: function (e) {
                addMenu(e);
            }
            },
            {
                title: '复制并新增部门', text: '复制并新增', key: 'mycost_copy', click: function (e) {
                CopyMenu(e, 1);
            }
            },
            {
                title: '删除部门', text: '删除', key: 'mycost_b', click: function (e) {
                DelMenu(e);
            }
            },
            {
                title: '修改部门', text: '修改', key: 'mycost_c', click: function (e) {
                ModifyMenu(e, 0);
            }
            },
            {
                title: '查看部门', text: '详细', key: 'mycost_d', click: function (e) {
                DetailMenu(e);
            }
            }
        ]
    };

    function GetDataSource() {
        me.ds = {};
        me.ds['deptType'] = [{cnname: '部门', value: 0}, {cnname: '机构', value: 1}]
    }

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);


            // var btnEl = $('<button style="width:200px;height: 80px;">点击取得跨域JSON</button>').appendTo(temp);
            // btnEl.on('click', function (e) {
            //     var ps={}
            //     var url="";
            //     $.ajax({
            //         type: "get",
            //         url: url,
            //         data:ps,
            //         dataType: "jsonp",
            //         success: function (data) {
            //             alert(data);
            //             //渲染模版
            //             //var html = template('template', {list: data.results[0].weather_data})
            //             //$('tbody').html(html);
            //
            //         }
            //     });
            // });
            InitLeftToolbar(temp);
            LoadMenu('', 1, 20);
            GetDataSource();
            //var mainEl = $('<div class="mainban"></div>').appendTo(temp);
            //var liGroupEl = $('<ul></ul>').appendTo(temp);
            var arr = [{title: 'xx', isPast: 0}, {title: 'xx', isPast: 1}, {title: 'xx', isPast: 1}, {
                title: 'xx',
                isPast: 0
            }]
            var o = getCombinArr(arr);
            //renderCisiList(liGroupEl, o);

            var gridRoot = $('<div class="row no-padding" style="margin:0px 10px;"></div>').appendTo(tab.c);
            var leftRoot = $('<div class="col-xs-3 col-md-3" style="padding: 0px 15px 0px 0px;"></div>').appendTo(gridRoot);
            var rightRoot = $('<div class="col-xs-9 col-md-9 no-padding"></div>').appendTo(gridRoot);
            //var grid = $('<div class="iTreeTable"></div>').appendTo(gridRoot);

            //var widgetEl = leftRoot.widget({title: '组织机构', toolbar: true});
            //loadTree(widgetEl.body);
        }
        me.execCommand('show', {a: args.a});

    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });
};
