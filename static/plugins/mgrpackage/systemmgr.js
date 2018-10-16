IWF.plugins['systemmgr'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '系统管理', a: 'systemmgr', b: 'systemmgr', index: 3, canClose: true};

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
            url: '/Home/GetDepartment', //请求后台的URL（*）
            method: 'get', //请求方式（*）
            //toolbar: '#toolbar', //工具按钮用哪个容器
            striped: true, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: true, //是否启用排序
            sortOrder: "asc", //排序方式
            //queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, //初始化加载第一页，默认第一页
            pageSize: 10, //每页的记录行数（*）
            pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
            //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
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
            clickToSelect: true, //是否启用点击选中行
            height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            checkboxHeader: true,
            checkboxEnable: true,
            columns: [{
                checkbox: true, title: '', field: 'ID',
            }, {
                field: 'Number', title: '序号', width: 60, formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'deptname', sortable: true,
                title: '系统名称'
            }, {
                field: 'pdeptname', sortable: true,
                title: '标题'
            }, {
                field: 'level', sortable: true,
                title: '主题'
            }, {
                field: 'remark',
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

    function addSystemSet() {

    }

    function AddSystemSet() {

    }

    function DelSystemSet() {

    }

    function ModifySystemSet() {

    }

    function DetailSystemSet() {

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

    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        me.flowTool.ToolBar(toolConfig);

        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);

        me.flowbox = me.flowform.SearchBox({
            click: function (e) {
                LoadLitchi(e.text, 1, 20);
            }, height: 220, html: 'forms/F000001/SystemSet_Ad.html', load: function (e) {

            }
        });
        me.flowGrid = $('<div style="width:100%;float:left;" ></div>').appendTo(el);

    }

    var toolConfig = {
        data: [
            {
                title: '新增', text: '新增', key: 'mycost_a', click: function (e) {
                addSystemSet(e);
            }
            },
            {
                title: '复制并新增', text: '复制并新增', key: 'mycost_copy', click: function (e) {
                AddSystemSet(e, 1);
            }
            },
            {
                title: '删除', text: '删除', key: 'mycost_b', click: function (e) {
                DelSystemSet(e);
            }
            },
            {
                title: '修改', text: '修改', key: 'mycost_c', click: function (e) {
                ModifySystemSet(e, 0);
            }
            },
            {
                title: '查看', text: '详细', key: 'mycost_d', click: function (e) {
                DetailSystemSet(e);
            }
            }
        ]
    };

    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);

            var mainEl = $('<div class="mainban"></div>').appendTo(temp);
            var liGroupEl = $('<ul></ul>').appendTo(mainEl);
            var arr = [{title: 'xx', isPast: 0}, {title: 'xx', isPast: 1}, {title: 'xx', isPast: 1}, {
                title: 'xx',
                isPast: 0
            }]
            InitLeftToolbar(temp);
            LoadLitchi('', 1, 20);
            var o = getCombinArr(arr);
            //renderCisiList(liGroupEl, o);

            var gridRoot = $('<div class="row no-padding" style="margin:0px 10px;"></div>').appendTo(tab.c);
            //var leftRoot = $('<div class="col-xs-3 col-md-3 no-padding"></div>').appendTo(gridRoot);
            //var rightRoot = $('<div class="col-xs-9 col-md-9"></div>').appendTo(gridRoot);
            var grid = $('<table></table>').appendTo(gridRoot);
            renderGrid(grid);
            //var widgetEl=leftRoot.widget({title:'xiaobao',toolbar:true});
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
