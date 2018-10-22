IWF.plugins['menumgr'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '菜单管理', a: 'menumgr', b: 'menumgr', index: 3, canClose: true};
    var setting = {
        view: {
            showLine: false
        },
        data: {
            key: {
                title: "name"
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
        me.flowTool.empty();
        //var This={};
        me.pnl = me.flowGrid.Form({
            html: '/static/forms/F000002/addMenu.html', title: '新增菜单', load: function (e) {
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.name = el.find('#menuname').val();
                    This.link = el.find('#link').val();
                    This.type = el.find('#type').val();
                    This.menukey = el.find('#menukey').val();
                    This.iconCls = el.find('#iconCls').val();
                    This.sortIndex = el.find('#sortIndex').val();
                    //This.pid=-1;
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'menu/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
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
                return $.fn.alert({success: true, msg: '有子菜单，不允许删除'});
        }
        var ids = arr.join(',');
        var tpl = '<h4>你确定要删除[' + arr.length + ']条记录吗?</h4>';
        $('body').Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'menu/del.data', {ids: ids, sid: me.sid, type: 1}, function (json, scope) {
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
            html: '/static/forms/F000002/addMenu.html', title: '修改菜单', load: function (e) {
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
                e.find('#link').val(rows[0].link);
                e.find('#menuname').val(rows[0].name);
                e.find('#menukey').val(rows[0].menukey);
                e.find('#iconCls').val(rows[0].iconCls);
                e.find('#sortIndex').val(rows[0].sortIndex);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.id = rows[0].id;
                    This.name = el.find('#menuname').val();
                    This.link = el.find('#link').val();
                    This.type = el.find('#type').val();
                    This.menukey = el.find('#menukey').val();
                    This.iconCls = el.find('#iconCls').val();
                    This.sortIndex = el.find('#sortIndex').val();
                    This.pid = rows[0].pid;
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'menu/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
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
        me.pnl = me.flowGrid.Form({
            html: '/static/forms/F000002/addMenu.html', title: '复制并新增菜单', load: function (e) {
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
                e.find('#link').val(rows[0].link);
                e.find('#menuname').val(rows[0].name);
                e.find('#menukey').val(rows[0].menukey);
                e.find('#iconCls').val(rows[0].iconCls);
                e.find('#sortIndex').val(rows[0].iconCls);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.name = el.find('#menuname').val();
                    This.link = el.find('#link').val();
                    This.type = el.find('#type').val();
                    This.menukey = el.find('#menukey').val();
                    This.iconCls = el.find('#iconCls').val();
                    This.sortIndex = el.find('#sortIndex').val();
                    This.pid = -1;
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'menu/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
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
            html: '/static/forms/F000002/detailMenu.html', title: '菜单详细信息', load: function (el) {
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
            return (type) ? '[<span style="color:red;">是</span>]' : '[<span style="color:green;">否</span>]';
        },
        getName: function (type) {
            return iwfTool.getVDict(me.ds['costtype'], 'value', type);
        },
        cale: function (p, d) {
            return p;
        },
        columns: [
            {title: '编号', text: '{id}', width: '30%'}
            , {title: '菜单KEY', text: '{menukey}', width: '15%'}
            , {title: '链接地址', text: '{link}', width: '20%', sortable: true}
            , {title: '归属', text: '{tenantId}', width: '10%'}
            , {title: '同级顺序', text: '{sortIndex}', width: '10%'}
            //, { title: '创建时间', text: '{changeDate(createtime)}', width: '150px' }
            , {title: '图标', text: '{iconCls}', width: '15%'}
        ],
        sort: function (index, col, isDesc) {
            //alert(isDesc)
            LoadMenu('', 1, 20);
        }
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

        $.getJSON(me.rootPath + 'menu/view.data', ps, function (js, scope) {
            //var js={data:[],pageSize:20,pageCount:123,pageIndex:1,pageCount:23,total:1243}
            me.flowTool.PageBar(pageConfig, js);
            //    config.data=js.data;
            //    me.litchiGrid=me.gridEl.iwfGrid(config);
            js.rows = utils.sort(js.rows, 'sortIndex');
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
                title: '新增菜单', text: '新增', key: 'mycost_a', click: function (e) {
                addMenu(e);
            }
            },
            {
                title: '复制并新增菜单', text: '复制并新增', key: 'mycost_copy', click: function (e) {
                CopyMenu(e, 1);
            }
            },
            {
                title: '删除菜单', text: '删除', key: 'mycost_b', click: function (e) {
                DelMenu(e);
            }
            },
            {
                title: '修改菜单', text: '修改', key: 'mycost_c', click: function (e) {
                ModifyMenu(e, 0);
            }
            },
            {
                title: '查看菜单', text: '详细', key: 'mycost_d', click: function (e) {
                DetailMenu(e);
            }
            }
        ]
    };

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);


            InitLeftToolbar(temp);
            LoadMenu('', 1, 20);

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
