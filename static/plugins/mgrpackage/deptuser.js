IWF.plugins['deptuser'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '部门用户', a: 'deptuser', b: 'deptuser', index: 3, canClose: true};
    var setting = {
        view: {
            showLine: false
        },
        data: {
            key: {
                title: "name",
                name: 'dept_name'
            },
            simpleData: {
                enable: true,
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
            return (type == 0) ? '[<span style="color:red;">启用</span>]' : '[<span style="color:green;">禁用</span>]';
        },
        getName: function (type) {
            //return iwfTool.getVDict(me.ds['costtype'],'value',type);
            return (type == 0) ? '[<span style="color:red;">男</span>]' : '[<span style="color:green;">女</span>]';
        },
        cale: function (p, d) {
            return p;
        },
        columns: [
            {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
            , {title: '编号', text: '{autoid}', width: '60px'}
            , {title: '用户名称', text: '{username}', width: '60px'}
            , {title: '用户名称', text: '{fullname}', width: '90px'}
            , {title: '性别', text: '{getName(gender)}', width: '40px'}
            , {title: '手机号码', text: '{tel}', width: '80px'}
            , {title: '状态', text: '{typeZone(userState)}', width: '60px'}
            , {title: 'UKEY', text: '{userKey}', width: '240px'}
            , {title: '创建时间', text: '{changeDate(createtime)}', width: '130px'}
            , {title: '描述', text: '{description}', width: '120px'}
        ],
        linkclick: function (sender, data) {
            var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            LoadEpInfo(data);
            GetGoodsByEpId(me.epItemListEl, 1, 25, data);
        },
        rowclick: function (sender) {
            alert(sender.data);
        }
    };


    function addUser(e) {
        var rows = me.deptTree.getSelectedNodes();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择部门记录'});
        }
        showUsers(toolConfig.deptid);
    }

    function showUsers(roleid) {
        //toolConfigWin.roleid=roleid;
        var tpl = '<div class="row"></div>';
        $('body').Dialog({
            title: '提示', tpl: tpl, width: 1000, height: 450, load: function (e) {

                me.winTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(e);
                //me.winTool.ToolBar(toolConfigWin);
                me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.winTool);

                me.flowbox = me.flowform.SearchBox({
                    click: function (e) {
                        LoadRole(e.text, 1, 25);
                    }, height: 220, html: 'forms/F000001/Role_Ad.html', load: function (e) {

                    }
                });
                me.winGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(e);
                LoadWinUser('', 1, 20, roleid);
            }, click: function (e) {
                if (e.data.ok) {
                    var rows = me.winDataGrid.getSelected();
                    var arr = [];
                    for (var i = 0; i < rows.length; i++) {
                        arr.push(rows[i].id);
                    }
                    if (arr.length == 0) {
                        return $.fn.alert({success: true, msg: '请先选择记录'});
                    }
                    var ids = arr.join(",");
                    $.getJSON(me.rootPath + 'dept/addUserToDept.data', {
                        roleid: roleid,
                        userids: ids,
                        sid: me.sid,
                        type: 0
                    }, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            showRoleUsers('', 1, 20, roleid);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function DelUser(type) {
        var rows = me.dataGrid.getSelected();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        var ids = arr.join(',');
        var roleid = toolConfig.deptid;
        var tpl = '<h4>你确定要删除[' + arr.length + ']条记录吗?</h4>';
        $('body').Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'dept/addUserToDept.data', {
                        roleid: roleid,
                        userids: ids,
                        sid: me.sid,
                        type: 1
                    }, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            showRoleUsers('', 1, 20, roleid);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function ModifyUser() {
        var rows = me.dataGrid.getSelected();
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
            html: 'forms/F000001/addUser.html', title: '修改用户', load: function (e) {
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
                e.find('#username').val(rows[0].username);
                e.find('#fullname').val(rows[0].fullname);
                e.find('#sex').val(rows[0].gender);
                e.find('#tel').val(rows[0].tel);
                e.find('#email').val(rows[0].email);
                e.find('#remark').val(rows[0].description);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.id = rows[0].id;
                    This.username = el.find('#username').val();
                    This.fullname = el.find('#fullname').val();
                    This.gender = el.find('#sex').val();
                    This.tel = el.find('#tel').val();
                    This.email = el.find('#email').val();
                    This.description = el.find('#remark').val();
                    $.getJSON(me.rootPath + 'user/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                        if (json.success) {
                            InitLeftToolbar(me.flowTool.parent());
                            LoadUser('', 1, 25);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadUser('', 1, 25);
                }
            }
        });
    }

    function CopyUser() {
        var rows = me.dataGrid.getSelected();
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
            html: 'forms/F000001/addUser.html', title: '复制并新增用户', load: function (e) {
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
                e.find('#username').val(rows[0].username);
                e.find('#fullname').val(rows[0].fullname);
                e.find('#sex').val(rows[0].gender);
                e.find('#tel').val(rows[0].tel);
                e.find('#email').val(rows[0].email);
                e.find('#remark').val(rows[0].description);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.username = el.find('#username').val();
                    This.fullname = el.find('#fullname').val();
                    This.gender = el.find('#sex').val();
                    This.tel = el.find('#tel').val();
                    This.email = el.find('#email').val();
                    This.description = el.find('#remark').val();
                    $.getJSON(me.rootPath + 'user/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                        if (json.success) {
                            InitLeftToolbar(me.flowTool.parent());
                            LoadUser('', 1, 25);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadUser('', 1, 25);
                }
            }
        });
    }

    function DetailUser() {
        var rows = me.dataGrid.getSelected();
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
            html: 'forms/F000001/detailUser.html', title: '用户详细信息', load: function (el) {
                var tpl = el.html();
                el.empty();
                $(utils.replaceTpl(tpl, This)).appendTo(el);
            }, click: function (e) {
                InitLeftToolbar(me.flowTool.parent());
                LoadUser('', 1, 25);
            }
        });
    }

    function activeUser(type) {
        var rows = me.dataGrid.getSelected();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        var ids = arr.join(',');
        var tpl = '<h4>你确定要激活[' + arr.length + ']条记录吗?</h4>';
        $('body').Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'user/active.data', {
                        ids: ids,
                        sid: me.sid,
                        type: type
                    }, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            LoadUser('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function pwdResetUser(type) {
        var rows = me.dataGrid.getSelected();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        var ids = arr.join(',');
        var tpl = '<h4>你确定要重置[' + arr.length + ']条记录吗?</h4>';
        $('body').Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'user/pwdreset.data', {
                        ids: ids,
                        sid: me.sid,
                        type: 0
                    }, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            LoadUser('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function setPwdUser() {
        var rows = me.dataGrid.getSelected();
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
            html: 'forms/F000001/pwdUser.html', title: '修改用户密码', load: function (e) {
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
                e.find('#username').val(rows[0].username);
                e.find('#fullname').val(rows[0].fullname);

            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.id = rows[0].id;
                    This.username = el.find('#username').val();
                    This.fullname = el.find('#fullname').val();
                    This.oldPwd = el.find('#oldPwd').val();
                    This.newPwd = el.find('#newPwd').val();
                    This.comfirmPwd = el.find('#comfirmPwd').val();
                    if (This.newPwd != This.comfirmPwd) {
                        return $.fn.alert({success: true, msg: '请先选择记录'});
                    }

                    $.getJSON(me.rootPath + 'user/pwd.data', {
                        id: This.id,
                        newPwd: This.comfirmPwd,
                        oldPwd: This.oldPwd
                    }, function (json, scope) {
                        if (json.success) {
                            InitLeftToolbar(me.flowTool.parent());
                            LoadUser('', 1, 25);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadUser('', 1, 25);
                }
            }
        });
    }

    function FindDept(keyword, index, size) {
        if (utils.isEmptyObject(keyword)) {
            return;
        }

        var treeObj = me.deptTree;//$.fn.zTree.getZTreeObj("tree-obj");
        //var keywords=$("#keyword").val();
        var nodes = treeObj.getNodesByParamFuzzy("deptName", keyword, null);
        if (nodes.length > 0) {
            treeObj.selectNode(nodes[0]);
        }
    }

    var configDept = {
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
            //{ title: '编号', text: '{autoid}', width: '50%' }
            {title: '部门', text: '{deptName}', width: '60%'}
            , {title: '类型', text: '{typeZone(dept_type)}', width: '20%'}
            , {
                title: '操作',
                text: '<a level="2010" href="javascript:void(0)"><span class="label label-info" style="line-height: initial;">查看用户</span></a>',
                width: '20%'
            }

            //, { title: '电话', text: '{tel}', width: '30%' }
            //, { title: '创建时间', text: '{changeDate(createtime)}', width: '15%' }
            //, { title: '描述', text: '{description}', width: '20%' }
        ],
        linkclick: function (sender, data) {
            var level = $(this).attr("level");
            if (level == 2010) {
                toolConfig.deptid = sender.data.id;
                showRoleUsers('', 1, 20, sender.data.id);
            }
            if (level == 2011) {
                showUsers(data.id);
            }
        },
    }

    function showRoleUsers(keyword, index, size, deptid) {

        var ps = {
            keyword: keyword || '',
            isDeleted: 0,
            type: 0,
            fromdate: '',
            todate: '',
            roleid: deptid,
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
                showRoleUsers('', pageIndex, pageSize, deptid);
            }
        };

        $.getJSON(me.rootPath + 'dept/deptUsersView.data', ps, function (js, scope) {
            me.flowTool.PageBar(pageConfig, js);
            if (js.rows.length == 0) {
                $.fn.alert({success: true, msg: '没有数据'});
            }
            config.data = js.rows;
            me.dataGrid = me.flowGrid.iwfGrid(config);
        });
    }

    function LoadDept(keyword, index, size) {
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

        $.getJSON(me.rootPath + 'dept/view.data', ps, function (js, scope) {
            me.deptTree = me.ztreeEl.iTreeTable({setting: setting, data: js.rows, config: configDept});
            me.deptTree.expandAll(true);
        });
    }

    function LoadInitUser(keyword, index, size) {
        var pageConfig = {
            total: 0,
            pageSize: 20,
            pageCount: 0,
            pageIndex: 1,
            pageclick: function (pageIndex, pageSize) {
                LoadUser('', pageIndex, pageSize);
            }
        };
        me.flowTool.PageBar(pageConfig, pageConfig);
        config.data = [];
        me.dataGrid = me.flowGrid.iwfGrid(config);
    }

    function InitRightToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        me.flowTool.ToolBar(toolConfig);

        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);

        me.flowbox = me.flowform.iBox({
            layout: 'right', click: function (e) {
                var rows = me.deptTree.getSelectedNodes();
                var arr = [];
                for (var i = 0; i < rows.length; i++) {
                    arr.push(rows[i].id);
                }
                if (arr.length == 0) {
                    return $.fn.alert({success: true, msg: '请先选择部门记录'});
                }
                showRoleUsers(e.text, 1, 20, toolConfig.deptid);
            }, height: 220, html: 'forms/F000002/addUser.html', load: function (e) {

            }
        });
        me.flowGrid = $('<div style="width:100%;float:left;background: white;" ></div>').appendTo(el);
        //me.flowGrid = $('<div class="row no-padding" style="margin:0px 10px;"></div>').appendTo(tab.c);
        // var leftRoot = $('<div class="col-xs-3 col-md-3" style="padding: 0px 15px 0px 0px;"></div>').appendTo(me.flowGrid);
        // var rightRoot = $('<div class="col-xs-9 col-md-9 no-padding"></div>').appendTo(me.flowGrid);
        // me.userGrid = $('<table></table>').appendTo(rightRoot);
        //me.usergrid=renderGrid(grid);
        LoadInitUser('', 1, 25);

    }

    function InitLeftToolbar(el) {
        el.empty();
        me.flowformRigth = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);
        //me.flowToolRigth.ToolBar(toolConfig);
        me.flowformRigth = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowformRigth);
        me.flowformRigth.css('padding-left', 0);
        me.flowboxRigth = me.flowformRigth.iBox({
            click: function (e) {
                FindDept(e.text, 1, 20);
            }, height: 220, html: 'forms/F000002/addUser.html', load: function (e) {

            }
        });

        me.ztreePanel = $('<div class="iTreeTable" style="width:100%;height:100%;background: white;margin-top:6px;"></div>').appendTo(el);
        me.ztreeEl = $('<ul class="ztree" style="width:100%;height:100%"></ul>').appendTo(me.ztreePanel);
        LoadDept('', 1, 25);
    }

    function LoadUser(keyword, index, size) {
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
                LoadUser('', pageIndex, pageSize);
            }
        };

        $.getJSON(me.rootPath + 'user/view.data', ps, function (js, scope) {
            me.flowTool.PageBar(pageConfig, js);
            config.data = js.rows;
            me.dataGrid = me.flowGrid.iwfGrid(config);
        });

    }

    function LoadWinUser(keyword, index, size) {
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
                LoadWinUser('', pageIndex, pageSize);
            }
        };

        $.getJSON(me.rootPath + 'user/view.data', ps, function (js, scope) {
            me.winTool.PageBar(pageConfig, js);
            config.data = js.rows;
            me.winDataGrid = me.winGrid.iwfGrid(config);
        });

    }

    var toolConfig = {
        data: [
            {
                title: '新增消费', text: '新增', key: 'mycost_a', click: function (e) {
                addUser(e);
            }
            },
            {
                title: '删除消费', text: '删除', key: 'mycost_b_a', click: function (e) {
                DelUser(0);
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
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;"></div>').appendTo(tab.c);
            var leftRoot = $('<div class="col-xs-4 col-md-4" style="padding: 0px 15px 0px 0px;"></div>').appendTo(temp);
            var rightRoot = $('<div class="col-xs-8 col-md-8 no-padding"></div>').appendTo(temp);
            InitLeftToolbar(leftRoot);
            InitRightToolbar(rightRoot);
            //LoadLitchi('', 1, 20);
            GetDataSource();

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
