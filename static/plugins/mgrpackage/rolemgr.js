IWF.plugins['rolemgr'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '角色管理', a: 'rolemgr', b: 'rolemgr', index: 3, canClose: true};

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
            , {title: '编号', text: '{autoid}', width: '60px'}
            , {title: '角色名称', text: '<a href="javascript:void(0)">{rolename}</a>', width: '120px'}
            , {title: '标题', text: '{title}', width: '60px', sortable: true}
            , {title: '是否管理员', text: '{typeZone(admin)}', width: '80px'}
            , {title: '是否根用户', text: '{typeZone(root)}', width: '80px'}
            //, { title: '创建时间', text: '{changeDate(createtime)}', width: '150px' }
            , {title: '描述', text: '{description}', width: '120px'}
            , {
                title: '操作',
                text: '<a level="2010" href="javascript:void(0)"><span class="label label-default">查看用户</span></a><a level="2011" style="margin:0px 15px;" href="javascript:void(0)"><span class="label label-info">添加用户</span></a>',
                width: '220px'
            }
        ],
        linkclick: function (sender, data) {
            var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            var level = $(sender).attr("level");
            if (level == 2010) {
                showRoleUsers(data.id);
            }
            if (level == 2011) {
                showUsers(data.id);
            }
        },
        sort: function (index, col, isDesc) {
            LoadRole('', 1, 20);
        },
        rowclick: function (sender) {
            alert(sender.data);
        }
    };

    var configUser = {
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
            //LoadEpInfo(data);
            GetGoodsByEpId(me.epItemListEl, 1, 25, data);
        },
        rowclick: function (sender) {
            alert(sender.data);
        }
    };

    function loadRoleUsers(keyword, index, size, roleid) {
        var ps = {
            keyword: keyword || '',
            //isDeleted:0,
            type: 0,
            //fromdate:'',
            //todate:'',
            //userid:me.options.userInfo.id,
            roleid: roleid,
            index: index,
            size: size
        };
        var pageConfig = {
            total: 0,
            pageSize: 20,
            pageCount: 0,
            pageIndex: 1,
            pageclick: function (pageIndex, pageSize) {
                loadRoleUsers('', pageIndex, pageSize, roleid);
            }
        };

        $.getJSON(me.rootPath + 'role/roleUsersView.data', ps, function (js, scope) {
            me.winTool.PageBar(pageConfig, js);
            configUser.data = js.rows;
            me.dataWinGrid = me.winGrid.iwfGrid(configUser);
        });

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
            me.winTool.PageBar(pageConfig, js);
            configUser.data = js.rows;
            me.dataWinGrid = me.winGrid.iwfGrid(configUser);
        });

    }

    function DelUssersFromRole() {
        var roleid = toolConfigWin.roleid;
        var rows = me.dataWinGrid.getSelected();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
        }
        if (arr.length == 0) {
            return $.fn.alert({success: true, msg: '请先选择记录'});
        }
        var ids = arr.join(',');
        $.getJSON(me.rootPath + 'role/addUserToRole.data', {
            roleid: roleid,
            userids: ids,
            sid: me.sid,
            type: 1
        }, function (json, scope) {
            if (json.success) {
                loadRoleUsers('', 1, 20, roleid);
                $.fn.alert({success: true, msg: json.msg});
            } else {
                $.fn.alert({success: true, msg: json.msg});
            }
        });
    }

    function showRoleUsers(roleid) {

        toolConfigWin.roleid = roleid;
        var tpl = '<div class="row"></div>';
        $('body').Dialog({
            title: '提示', tpl: tpl, width: 1000, height: 450, load: function (e) {

                me.winTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(e);
                me.winTool.ToolBar(toolConfigWin);
                me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.winTool);

                me.flowbox = me.flowform.iBox({
                    layout: 'right', click: function (e) {
                        loadRoleUsers(e.text, 1, 25, roleid);
                    }, height: 220, html: 'forms/F000001/Role_Ad.html', load: function (e) {

                    }
                });
                me.winGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(e);
                loadRoleUsers('', 1, 20, roleid);
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'role/del.data', {ids: ids, sid: me.sid, type: 1}, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            LoadRole('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function LoadSelectedUser(keyword, index, size) {
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

        //$.getJSON(me.rootPath+'user/view.data', ps, function (js, scope) {
        //me.winToolRight.PageBar(pageConfig,js);
        configUser.data = [];
        me.dataWinGridRight = me.winGridRight.iwfGrid(configUser);
        //});
    }

    function addUserToGrid() {
        var rows = me.dataWinGrid.getSelected();
        var arr = [{
            "id": 5,
            "tenantId": "",
            "username": "2222",
            "password": "",
            "fullname": "111",
            "email": "11",
            "address": "",
            "postcode": "",
            "fax": "",
            "description": "1111",
            "user_state": 0,
            "user_key": "89ad4067-c3ba-4e12-951f-4a2297be1ff5",
            "isDeleted": 0,
            "gender": 1,
            "comfirmMethod": 0,
            "idcardNo": "",
            "regTime": "",
            "officeTel": "",
            "blockUpTime": "",
            "isStartUp": 0,
            "loginnum": 0,
            "createtime": "",
            "ulevel": "",
            "type": 0,
            "tel": "11",
            "tel2": "",
            "sign": "",
            "lastupdate": "2018-06-20 00:00:00",
            "cnname": "",
            "qq": "",
            "position": "",
            "link": "",
            "age": 0,
            "autoid": "",
            "comid": 0,
            "wx": "",
            "version": ""
        }];
        var rows2 = me.dataWinGridRight.getData();
        var rows3 = utils.mergeArray(rows, rows2);// rows.concat(rows2);
        me.dataWinGridRight.renderData(rows3);
    }

    function removeUserToGrid() {
        var rows = me.dataWinGridRight.getSelected();
        var arr = [{
            "id": 5,
            "tenantId": "",
            "username": "2222",
            "password": "",
            "fullname": "111",
            "email": "11",
            "address": "",
            "postcode": "",
            "fax": "",
            "description": "1111",
            "user_state": 0,
            "user_key": "89ad4067-c3ba-4e12-951f-4a2297be1ff5",
            "isDeleted": 0,
            "gender": 1,
            "comfirmMethod": 0,
            "idcardNo": "",
            "regTime": "",
            "officeTel": "",
            "blockUpTime": "",
            "isStartUp": 0,
            "loginnum": 0,
            "createtime": "",
            "ulevel": "",
            "type": 0,
            "tel": "11",
            "tel2": "",
            "sign": "",
            "lastupdate": "2018-06-20 00:00:00",
            "cnname": "",
            "qq": "",
            "position": "",
            "link": "",
            "age": 0,
            "autoid": "",
            "comid": 0,
            "wx": "",
            "version": ""
        }];
        var rows2 = me.dataWinGridRight.getData();
        for (var i = 0; i < rows2.length; i++) {
            var row = rows2[i];
            utils.removeItem(rows2, row)
        }
        me.dataWinGridRight.renderData(rows2);
    }

    function showUsers(roleid) {
        var tpl = '<ul class="row lineSplit"><li style="width:500px;">x</li><li style="width:100px;"><a class="btn btn-primary add-li">>></a><a class="btn btn-default"><<</a></li><li style="width:400px;">3</li></ul>';
        $('body').Dialog({
            title: '提示', html: 'forms/F000001/addUserToRole.html', width: 1140, height: 450, load: function (e) {

                me.winTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(e.find('li:eq(0)'));
                //me.winTool.ToolBar(toolConfig);
                me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.winTool);

                me.flowbox = me.flowform.iBox({
                    click: function (e) {
                        LoadUser(e.text, 1, 10);
                    }, height: 220, html: 'forms/F000001/Role_Ad.html', load: function (e) {

                    }
                });
                me.winGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(e.find('li:eq(0)'));
                LoadUser('', 1, 10);

                me.winToolRight = $('<div style="height:40px;width:100%;" ></div>').appendTo(e.find('li:eq(2)'));
                //me.winTool.ToolBar(toolConfig);
                me.flowformRight = $('<div class="navbar-form navbar-left"></div>').appendTo(me.winToolRight);

                // me.flowboxRight = me.flowformRight.iBox({ click : function(e) {
                //     LoadSelectedUser(e.text, 1, 25);
                // },height:220,html:'forms/F000001/Role_Ad.html',load:function(e){
                //
                // } });
                me.winGridRight = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(e.find('li:eq(2)'));
                LoadSelectedUser('', 1, 10);
                e.find('li:eq(1)').find('a.btn-primary').bind('click', addUserToGrid);
                e.find('li:eq(1)').find('a.btn-default').bind('click', removeUserToGrid);
            }, click: function (e) {
                if (e.data.ok) {
                    var rows = me.dataWinGridRight.getData();
                    var arr = [];
                    for (var i = 0; i < rows.length; i++) {
                        arr.push(rows[i].id);
                    }
                    if (arr.length == 0) {
                        return $.fn.alert({success: true, msg: '请先选择记录'});
                    }
                    var ids = arr.join(",");
                    $.getJSON(me.rootPath + 'role/addUserToRole.data', {
                        roleid: roleid,
                        userids: ids,
                        sid: me.sid,
                        type: 0
                    }, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            LoadRole('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function GetDataSource() {
        me.ds = {};
        me.ds['unit'] = iwfTool.getDict(me.options.dict, 'pid', 18);
        me.ds['costtype'] = iwfTool.getDict(me.options.dict, 'pid', 117);
        var data = [{field: '普通商品', text: '1'}, {field: '菜单', text: '2'}, {field: '服务产品', text: '3'}];
        me.ds['goodstype'] = data;
    }

    function addRole(e) {
        me.flowTool.empty();
        var This = {};
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/addRole.html', title: '新增角色/用户组', load: function (e) {
                //e.find('#costDate').datetimepicker({format:'yyyy-mm-dd hh:mm:ss',language:'zh-CN'});
                //me.unitCmb = e.find('#unit').ComboBox({ data : me.ds['unit'], field : 'cnname', value : 'value', name : '选择单位类型' });
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.roleName = el.find('#rolename').val();
                    This.title = el.find('#title').val();
                    This.description = el.find('#remark').val();
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'role/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    LoadRole('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadRole('', 1, 25);
                }
            }
        });
    }

    function DelRole(e) {
        var rows = me.dataGrid.getSelected();
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].id);
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
                    $.getJSON(me.rootPath + 'role/del.data', {ids: ids, sid: me.sid, type: 1}, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: json.msg});
                            LoadRole('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
                }
            }
        });
    }

    function ModifyRole(e) {
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
            html: 'forms/F000001/addRole.html', title: '修改角色/用户组', load: function (e) {
                e.find('#title').val(rows[0].title);
                e.find('#rolename').val(rows[0].roleName);
                e.find('#remark').val(rows[0].description);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    This.id = rows[0].id;
                    This.roleName = el.find('#rolename').val();
                    This.title = el.find('#title').val();
                    This.description = el.find('#remark').val();
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'role/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    LoadRole('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadRole('', 1, 25);
                }
            }
        });
    }

    function DetailRole() {
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
            html: 'forms/F000001/detailRole.html', title: '角色/用户组详细信息', load: function (el) {
                var tpl = el.html();
                el.empty();
                $(utils.replaceTpl(tpl, This)).appendTo(el);
            }, click: function (e) {
                InitLeftToolbar(me.flowTool.parent());
                LoadRole('', 1, 25);
            }
        });
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
        el.bootstrapTable({
            url: me.rootPath + 'role/view.data', //请求后台的URL（*）
            method: 'get', //请求方式（*）
            //toolbar: '#toolbar', //工具按钮用哪个容器
            striped: true, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: true, //是否启用排序
            sortOrder: "asc", //排序方式
            queryParams: function (params) {
                var idx = (params.offset / params.limit) + 1;
                return {
                    //json: utils.fromJSON(collectionParams()),
                    keyword: "asc",
                    size: params.limit,
                    index: idx,
                    type: 1,
                    sortOrder: params.order
                }
            },
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, //初始化加载第一页，默认第一页
            pageSize: 10, //每页的记录行数（*）
            pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
            search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            // data: [{ID: 1, deptname: 'xiao', pdeptname: 'bao', level: 'next', remark: 'my good is id'}, {
            //     ID: 2,
            //     deptname: 'xiao1',
            //     pdeptname: 'bao2',
            //     level: 'next2',
            //     remark: 'my good is id'
            // }, {ID: 3, deptname: 'xiao3', pdeptname: 'bao3', level: 'next3', remark: 'my good is id'}],
            showColumns: false, //是否显示所有的列
            showRefresh: false, //是否显示刷新按钮
            minimumCountColumns: 2, //最少允许的列数
            clickToSelect: false, //是否启用点击选中行
            height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            checkboxHeader: true,
            checkboxEnable: true,
            columns: [{
                checkbox: true, title: '', field: 'id',
            }, {
                field: 'Number', title: '序号', width: 60, formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'roleName', sortable: true,
                title: '角色名称'
            }, {
                field: 'title', sortable: true,
                title: '角色标题'
            }, {
                field: 'description',
                title: '描述'
            },]
        });

    }

    function loadTree(el) {
        var DataSourceTree = function (options) {
            this._data = options.data;
            this._delay = options.delay;
        };

        DataSourceTree.prototype = {

            data: function (options, callback) {
                var self = this;

                setTimeout(function () {
                    var data = $.extend(true, [], self._data);

                    callback({data: data});

                }, this._delay)
            }
        };
        var treeDataSource3 = new DataSourceTree({
            data: [
                {
                    name: 'Resources <div class="tree-actions"></div>',
                    type: 'folder',
                    'icon-class': 'palegreen',
                    additionalParameters: {id: 'F11'}
                },
                {
                    name: 'Projects <div class="tree-actions"></div>',
                    type: 'folder',
                    'icon-class': 'blueberry',
                    additionalParameters: {id: 'F12'}
                },
                {name: 'Nike Promo 2013', type: 'item', additionalParameters: {id: 'I11'}},
                {name: 'IPO Reports', type: 'item', additionalParameters: {id: 'I12'}}
            ],
            delay: 400
        });

        el.TreeView({data: treeDataSource3});
    }


    function LoadLitchi(keyword, index, size) {
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
                LoadLitchi('', pageIndex, pageSize);
            }
        };

        //$.getJSON('/ServiceFramework/litchi/list.data', ps, function (js, scope) {
        var js = {data: [], pageSize: 20, pageCount: 123, pageIndex: 1, pageCount: 23, total: 1243}
        me.flowTool.PageBar(pageConfig, js);
        //    config.data=js.data;
        //    me.litchiGrid=me.gridEl.iwfGrid(config);
        //});
    }

    function showLeft(row) {
        me.leftPanel.show(3000);
    }

    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);
        me.flowTool.ToolBar(toolConfig);
        // me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);
        //
        // me.flowbox = me.flowform.SearchBox({ click : function(e) {
        //     LoadRole(e.text, 1, 25);
        // },height:220,html:'forms/F000001/Role_Ad.html',load:function(e){
        //
        // } });
        me.flowGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(el);

        //me.rightTool = $('<div style="height:40px;width:45%;float:right;" ></div>').appendTo(el);

        //me.leftPanel = $('<div style="width:100%;float:left;background: #FFF;" >xxxdsdsd</div>').appendTo(el);
    }

    function InitUi(args) {
        InitLeftToolbar(args);
        //GetDataSource();
        LoadRole('', 1, 25);
    }

    var toolConfig = {
        data: [
            {
                title: '新增', text: '新增', key: 'mycost_a', click: function (e) {
                addRole(e);
            }
            },
            {
                title: '删除', text: '删除', key: 'mycost_b', click: function (e) {
                DelRole(e);
            }
            },
            {
                title: '修改', text: '修改', key: 'mycost_c', click: function (e) {
                ModifyRole(e, 0);
            }
            },
            {
                title: '查看', text: '详细', key: 'mycost_d', click: function (e) {
                DetailRole(e);
            }
            }
        ]
    };
    var toolConfigWin = {
        data: [
            //{ title: '新增消费', text: '新增', key: 'mycost_a', click: function(e){addRole(e);} },
            {
                title: '删除消费', text: '删除', key: 'mycost_b', click: function (e) {
                DelUssersFromRole(e);
            }
            }
            //{ title: '修改消费', text: '修改', key: 'mycost_c', click: function(e){ModifyRole(e,0);} },
            //{ title: '查看消费', text: '详细', key: 'mycost_d', click: function(e){DetailRole(e);}}
        ]
    };

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);

            InitUi(temp);
            //LoadLitchi('', 1, 20);

            //var mainEl = $('<div class="mainban"></div>').appendTo(temp);
            //var liGroupEl = $('<ul></ul>').appendTo(temp);
            var arr = [{title: 'xx', isPast: 0}, {title: 'xx', isPast: 1}, {title: 'xx', isPast: 1}, {
                title: 'xx',
                isPast: 0
            }]
            //var o = getCombinArr(arr);
            //renderCisiList(liGroupEl, o);

            //var gridRoot = $('<div class="row no-padding" style="margin:0px 10px;"></div>').appendTo(tab.c);
            //var leftRoot = $('<div class="col-xs-3 col-md-3" style="padding: 0px 15px 0px 0px;"></div>').appendTo(gridRoot);
            //var rightRoot = $('<div class="col-xs-9 col-md-9 no-padding"></div>').appendTo(gridRoot);
            //var grid = $('<table></table>').appendTo(rightRoot);
            //renderGrid(grid);
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
