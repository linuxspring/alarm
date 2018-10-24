IWF.plugins['rulemgr'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '权限管理', a: 'rulemgr', b: 'rulemgr', index: 3, canClose: true};
    var setting = {
        view: {
            showLine: false
        },
        check: {
            enable: true
        },
        data: {
            key: {
                title: "name",
                checked: "checked"
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: 'pid',
                rootPId: -1
            }
        }
    };
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
            {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
            , {title: '编号', text: '{id}', width: '60px'}
            , {title: '角色名称', text: '<a href="javascript:void(0)">{rolename}</a>', width: '120px'}
            , {title: '标题', text: '{title}', width: '60px'}
            , {title: '是否管理员', text: '{typeZone(admin)}', width: '80px'}
            , {title: '是否根用户', text: '{typeZone(root)}', width: '80px'}
            //, { title: '创建时间', text: '{changeDate(createtime)}', width: '150px' }
            , {title: '描述', text: '{description}', width: '120px'}
            , {
                title: '操作',
                text: '<a level="2010" href="javascript:void(0)"><span class="label label-info" >查看菜单</span></a>',
                width: '220px'
            }
        ],
        linkclick: function (sender, data) {
            var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            var level = $(sender).attr("level");
            if (level == 2010) {
                showRoleMenu(data.id);
            }
            if (level == 2011) {
                //showUsers(data.id);
            }
        },
        rowclick: function (sender) {
            alert(sender.data);
        }
    };

    var configMenu = {
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
            {title: '编号', text: '{id}', width: '50%'}
            , {title: '菜单KEY', text: '{menukey}', width: '50%'}
            // , { title: '链接地址', text: '{link}', width: '20%' }
            // , { title: '归属', text: '{tenantId}', width: '10%' }
            // , { title: '是否根用户', text: '{typeZone(type)}', width: '10%' }
            // //, { title: '创建时间', text: '{changeDate(createtime)}', width: '150px' }
            // , { title: '图标', text: '{iconCls}', width: '15%' }
        ]
    }

    function LoadRole(keyword, index, size) {
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
                LoadRole('', pageIndex, pageSize);
            }
        };

        $.getJSON(me.rootPath + 'role/view.data', ps, function (js, scope) {
            me.flowTool.PageBar(pageConfig, js);
            config.data = js.rows;
            me.dataGrid = me.flowGrid.iwfGrid(config);
        });
    }

    function showRoleMenu(roleid) {
        var arr = [];
        $.getJSON(me.rootPath + 'rule/find.data', {roleid: roleid}, function (json) {
            if (json.success) {
                var ids = [];
                //me.menuTree=$.fn.zTree.init(me.ztreeEl, setting, json.obj);
                //me.menuTree.expandAll(true);
                if (utils.isEmptyObject(json.obj.menuIds)) {
                    ids = [];
                } else {
                    ids = json.obj.menuIds.split(',');// "1,2,3,14,15,4,5,6,6,6,7,8,9,10,11,12,13,18,18,16,17".split(',');
                }
                if (ids.length == 0) {
                    me.menuTree.checkAllNodes(false);
                }
                me.menuTree.checkAllNodes(false);
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    var node = me.menuTree.getNodeByParam("id", id, null);//.getNodeByTId(id);
                    //var node2 = me.menuTree.getNodeByParam("aoutid", 'R000021', null);//.getNodeByTId(id);
                    //var node3 = me.menuTree.getNodeByTId(id);
                    if (node != null)
                        me.menuTree.checkNode(node, true, true);
                }
                //    $.fn.alert({success: true, msg: json.msg});
            } else {
                $.fn.alert({success: true, msg: json.msg});
            }
        });
    }

    function addSystemSet() {
        me.menuTree.checkAllNodes(true);
    }

    function AddSystemSet() {
        me.menuTree.checkAllNodes(false);
    }

    function DelSystemSet() {
        var rowsRole = me.dataGrid.getSelected();
        var arr = [];
        for (var i = 0; i < rowsRole.length; i++) {
            arr.push(rowsRole[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        var roleRow = rowsRole[0];

        //var rows=me.menuTree.getSelectedNodes();
        var rows = me.menuTree.getCheckedNodes(true);
        var arr2 = [];
        for (var i = 0; i < rows.length; i++) {
            arr2.push(rows[i].id);
        }
        if (arr2.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        var ids = arr2.join(",");
        var This = {
            roleid: roleRow.id,
            menuIds: ids,
            funIds: ''
        }
        $.getJSON(me.rootPath + 'rule/save.data', {json: utils.fromJSON(This)}, function (json) {
            if (json.success) {
                //InitLeftToolbar(me.flowTool.parent());
                LoadMenu('', 1, 25);
                $.fn.alert({success: true, msg: json.msg});
            } else {
                $.fn.alert({success: true, msg: json.msg});
            }
        });
    }

    function ModifySystemSet() {

    }

    function DetailSystemSet() {

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
            //me.flowTool.PageBar(pageConfig,js);
            //    config.data=js.data;
            //    me.litchiGrid=me.gridEl.iwfGrid(config);
            js.rows = utils.sort(js.rows, 'sortIndex');
            me.menuTree = $.fn.zTree.init(me.ztreeEl, setting, js.rows);
            //me.dataGrid=me.ztreeEl.iTreeTable({setting:setting,data:js.rows,config:configMenu});
            me.menuTree.expandAll(true);
        });
    }

    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        //me.flowTool.ToolBar(toolConfig);

        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);

        me.flowbox = me.flowform.iBox({
            layout: 'right', click: function (e) {
                LoadRole(e.text, 1, 20);
            }, height: 220, html: 'forms/F000001/SystemSet_Ad.html', load: function (e) {

            }
        });
        me.flowGrid = $('<div style="width:100%;float:left;background: white;" ></div>').appendTo(el);

    }

    function InitRightToolbar(el) {
        el.empty();
        me.flowToolRigth = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);
        me.flowToolRigth.ToolBar(toolConfig);

        me.ztreePanel = $('<div style="width:100%;height:100%;background: white;margin-top:8px;"></div>').appendTo(el);
        me.ztreeEl = $('<ul class="ztree" style="width:100%;height:100%"></ul>').appendTo(me.ztreePanel);
        LoadMenu('', 1, 25);
    }

    var toolConfig = {
        data: [
            {
                title: '新增', text: '全选', key: 'mycost_a', click: function (e) {
                addSystemSet(e);
            }
            },
            {
                title: '复制并新增', text: '全清', key: 'mycost_copy', click: function (e) {
                AddSystemSet(e, 1);
            }
            },
            {
                title: '删除', text: '保存', key: 'mycost_b', click: function (e) {
                DelSystemSet(e);
            }
            }
            //{ title: '修改消费', text: '修改', key: 'mycost_c', click: function(e){ModifySystemSet(e,0);} },
            //{ title: '查看消费', text: '详细', key: 'mycost_d', click: function(e){DetailSystemSet(e);}}
        ]
    };

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;"></div>').appendTo(tab.c);


            //var mainEl = $('<div class="mainban"></div>').appendTo(temp);
            //var liGroupEl = $('<ul></ul>').appendTo(temp);
            var arr = [{title: 'xx', isPast: 0}, {title: 'xx', isPast: 1}, {title: 'xx', isPast: 1}, {
                title: 'xx',
                isPast: 0
            }]
            //renderCisiList(liGroupEl, o);

            var gridRoot = $('<div class="row no-padding" style="margin:0px 10px;"></div>').appendTo(tab.c);
            var leftRoot = $('<div class="col-xs-8 col-md-8" style="padding: 0px 15px 0px 0px;"></div>').appendTo(gridRoot);
            var rightRoot = $('<div class="col-xs-4 col-md-4 no-padding"></div>').appendTo(gridRoot);

            //me.leftTree = $('<div class="iTreeTable" style="width:100%;float:left;" ></div>').appendTo(rightRoot);

            //renderGrid(grid);
            InitLeftToolbar(leftRoot);
            InitRightToolbar(rightRoot);
            LoadRole('', 1, 25);


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
