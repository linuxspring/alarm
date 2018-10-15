IWF.plugins['profile'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '个人信息', a: 'profile', b: 'profile', index: 3, canClose: true};
    var config = {
        changeDate: function (d) {
            return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
        },
        typeZone: function (type) {
            return (type == 1) ? '[<span style="color:red;">启用</span>]' : '[<span style="color:green;">禁用</span>]';
        },
        getName: function (type) {
            return iwfTool.getVDict(me.ds['sex'], 'value', type);
            //return (type==1) ? '[<span style="color:red;">男</span>]' : '[<span style="color:green;">女</span>]';
        },
        cale: function (p, d) {
            return p;
        },
        columns: [
            {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
            , {title: '编号', text: '{autoid}', width: '60px'}
            , {title: '用户登录名称', text: '{username}', width: '60px'}
            , {title: '用户名称', text: '{fullname}', width: '90px'}
            , {title: '性别', text: '{getName(gender)}', width: '40px'}
            , {title: '手机号码', text: '{tel}', width: '80px'}
            , {title: '状态', text: '{typeZone(user_state)}', width: '60px'}
            , {title: 'UKEY', text: '{user_key}', width: '240px'}
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
        return el.bootstrapTable({
            url: me.rootPath + 'user/view.data', //请求后台的URL（*）
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
            data: [{ID: 1, deptname: 'xiao', pdeptname: 'bao', level: 'next', remark: 'my good is id'}, {
                ID: 2,
                deptname: 'xiao1',
                pdeptname: 'bao2',
                level: 'next2',
                remark: 'my good is id'
            }, {ID: 3, deptname: 'xiao3', pdeptname: 'bao3', level: 'next3', remark: 'my good is id'}],
            showColumns: false, //是否显示所有的列
            showRefresh: false, //是否显示刷新按钮
            minimumCountColumns: 2, //最少允许的列数
            clickToSelect: false, //是否启用点击选中行
            height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "user_id", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            checkboxHeader: true,
            checkboxEnable: true,
            columns: [{
                checkbox: true, title: '', field: 'user_id',
            }, {
                field: 'Number', title: '序号', width: 60, formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'user_name', sortable: true,
                title: '部门名称'
            }, {
                field: 'fullname', sortable: true,
                title: '上级部门'
            }, {
                field: 'type', sortable: true,
                title: '部门级别'
            }, {
                field: 'email',
                title: '描述'
            },]
        });

    }

    function addUser(e) {
        me.flowTool.empty();
        var This = {};
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/addUser.html', title: '新增用户', load: function (e) {
                me.sexCmb = e.find('#sex').ComboBox({
                    data: me.ds['sex'],
                    field: 'cnname',
                    value: 'value',
                    name: '选择性别类型'
                });
                me.sexCmb.setValue(me.ds['sex'][0]['cnname']);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.username = el.find('#username').val();
                    This.fullname = el.find('#fullname').val();
                    This.gender = me.sexCmb.getValue('value');//el.find('#sex').val();
                    This.tel = el.find('#tel').val();
                    This.email = el.find('#email').val();
                    This.description = el.find('#remark').val();
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'user/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    LoadUser('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
                        }
                    });

                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    LoadUser('', 1, 25);
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
        var tpl = '<h4>你确定要删除[' + arr.length + ']条记录吗?</h4>';
        $('body').Dialog({
            title: '提示', tpl: tpl, load: function (e) {
            }, click: function (e) {
                if (e.data.ok) {
                    $.getJSON(me.rootPath + 'user/del.data', {
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

    function ModifyUser() {
        var rows = [];
        rows[0] = me.options.userInfo;
        me.flowTool.empty();
        var This = {};
        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/addProfile.html', title: '修改用户', load: function (e) {
                //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
                e.find('#username').val(rows[0].username);
                e.find('#fullname').val(rows[0].fullname);
                me.sexCmb = e.find('#sex').ComboBox({
                    data: me.ds['sex'],
                    field: 'cnname',
                    value: 'value',
                    name: '选择性别类型'
                });
                me.sexCmb.setValue(iwfTool.getVDict(me.ds['sex'], 'value', rows[0]['gender']));
                //e.find('#sex').val(rows[0].gender);
                e.find('#tel').val(rows[0].tel);
                e.find('#email').val(rows[0].email);
                e.find('#address').val(rows[0].address);
                e.find('#idcardNo').val(rows[0].idcardNo);
                e.find('#wx').val(rows[0].wx);
                e.find('#remark').val(rows[0].description);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.id = rows[0].id;
                    This.username = el.find('#username').val();
                    This.fullname = el.find('#fullname').val();
                    This.gender = me.sexCmb.getValue('value');// el.find('#sex').val();
                    This.tel = el.find('#tel').val();
                    This.email = el.find('#email').val();
                    This.email = el.find('#email').val();
                    This.address = el.find('#address').val();
                    This.idcardNo = el.find('#idcardNo').val();
                    This.wx = el.find('#wx').val();
                    This.description = el.find('#remark').val();
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'user/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    DetailUser('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
                        }
                    });
                } else {
                    InitLeftToolbar(me.flowTool.parent());
                    DetailUser('', 1, 25);
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
                //e.find('#sex').val(rows[0].gender);
                me.sexCmb = e.find('#sex').ComboBox({
                    data: me.ds['sex'],
                    field: 'cnname',
                    value: 'value',
                    name: '选择性别类型'
                });
                me.sexCmb.setValue(iwfTool.getVDict(me.ds['sex'], 'value', rows[0]['gender']));
                e.find('#tel').val(rows[0].tel);
                e.find('#email').val(rows[0].email);
                e.find('#remark').val(rows[0].description);
            }, click: function (e) {
                if (e.data.ok) {
                    var el = me.pnl;
                    //This.cnname = el.find('#cnname').val();
                    This.username = el.find('#username').val();
                    This.fullname = el.find('#fullname').val();
                    This.gender = me.sexCmb.getValue('value');// el.find('#sex').val();
                    This.tel = el.find('#tel').val();
                    This.email = el.find('#email').val();
                    This.description = el.find('#remark').val();
                    me.flowGrid.validate({
                        load: function (ve) {
                            if (ve.data.length > 0) {
                                return;
                            }
                            $.getJSON(me.rootPath + 'user/save.data', {json: utils.fromJSON(This)}, function (json, scope) {
                                if (json.success) {
                                    InitLeftToolbar(me.flowTool.parent());
                                    LoadUser('', 1, 25);
                                } else {
                                    $.fn.alert({success: true, msg: json.msg});
                                }
                            });
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
        $.getJSON(me.rootPath + 'user/detail.data', {id: me.options.userInfo.id}, function (json) {
            var This = {};
            me.options.userInfo = json.obj;
            $.extend(This, me.options.userInfo);
            This.gender = iwfTool.getVDict(me.ds['sex'], 'value', This.gender);
            me.pnl = me.flowGrid.load('forms/F000001/profile.html', function (e) {
                me.flowGrid.empty();
                $(utils.replaceTpl(e, This)).appendTo(me.flowGrid);
                $(this).find('#editProfile').on('click', This, function (e) {
                    ModifyUser();
                });
            });
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

    function isDeletedUser() {
        alert('未开发')
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
        //var js={data:[],pageSize:20,pageCount:123,pageIndex:1,pageCount:23,total:1243}
        //me.flowTool.PageBar(pageConfig,js);
        //    config.data=js.data;
        //    me.litchiGrid=me.gridEl.iwfGrid(config);
        //});
    }

    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        // me.flowTool.ToolBar(toolConfig);
        //
        // me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);
        //
        // me.flowbox = me.flowform.iBox({
        //     layout: 'right',
        //     click: function (e) {
        //         LoadUser(e.text, 1, 20);
        //     }, height: 220, html: 'forms/F000002/addUser.html', load: function (e) {
        //
        //     }
        // });
        me.flowGrid = $('<div style="width:100%;float:left;background: white;" ></div>').appendTo(el);
        //me.flowGrid = $('<div class="row no-padding" style="margin:0px 10px;"></div>').appendTo(tab.c);
        // var leftRoot = $('<div class="col-xs-3 col-md-3" style="padding: 0px 15px 0px 0px;"></div>').appendTo(me.flowGrid);
        // var rightRoot = $('<div class="col-xs-9 col-md-9 no-padding"></div>').appendTo(me.flowGrid);
        // me.userGrid = $('<table></table>').appendTo(rightRoot);
        //me.usergrid=renderGrid(grid);
        // LoadUser('',1,25);

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

    var toolConfig = {
        data: [
            {
                title: '新增消费', text: '新增', key: 'mycost_a', click: function (e) {
                addUser(e);
            }
            },
            {
                title: '复制并新增消费', text: '复制并新增', key: 'mycost_copy', click: function (e) {
                CopyUser(e, 1);
            }
            },
            {
                title: '删除消费', text: '删除', key: 'mycost_b', menu: [
                {
                    title: '删除消费', text: '逻辑删除', key: 'mycost_b_a', click: function (e) {
                    DelUser(0);
                }
                },
                {
                    title: '删除消费', text: '物理删除', key: 'mycost_b_b', click: function (e) {
                    DelUser(1);
                }
                },
            ]
            },
            {
                title: '其它', text: '操作', key: 'mycost_b', menu: [
                {
                    title: '启用用户', text: '启用', key: 'mycost_b_a', click: function (e) {
                    activeUser(1);
                }
                },
                {
                    title: '禁用用户', text: '禁用', key: 'mycost_b_b', click: function (e) {
                    activeUser(0);
                }
                },
                {
                    title: '还原用户', text: '还原用户', key: 'mycost_b_b', click: function (e) {
                    isDeletedUser(0);
                }
                },
                {
                    title: '用户修改密码', text: '修改密码', key: 'mycost_b_c', click: function (e) {
                    setPwdUser(e);
                }
                },
                {
                    title: '用户密码重置', text: '密码重置', key: 'mycost_b_d', click: function (e) {
                    pwdResetUser(0);
                }
                },
            ]
            },
            {
                title: '修改消费', text: '修改', key: 'mycost_c', click: function (e) {
                ModifyUser(e, 0);
            }
            },
            {
                title: '查看消费', text: '详细', key: 'mycost_d', click: function (e) {
                DetailUser(e);
            }
            }
        ]
    };

    function GetDataSource() {
        me.ds = {};
        var pid = "";
        //先循环，找到PID，在循环，找到子项
        for (var i = 0; i < me.options.dict.length; i++) {
            if (me.options.dict[i].enname == 'sex') {
                pid = me.options.dict[i].id;
                break;
            }
        }
        me.ds['sex'] = iwfTool.getDict(me.options.dict, 'pid', pid);
    }

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);
            InitLeftToolbar(temp);
            GetDataSource();
            DetailUser();
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
