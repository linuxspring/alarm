IWF.plugins['logmgr'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '日志管理', a: 'logmgr', b: 'logmgr', index: 3, canClose: true};
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
            , {title: '编号', text: '{id}', width: '10%'}
            , {title: '用户名', text: '{operator}', width: '10%'}
            , {title: '日志级别', text: '{log_level}', width: '10%'}
            , {title: 'IP', text: '{ip}', width: '10%'}
            , {title: '操作时间', text: '{operator_time}', width: '15%'}
            , {title: '日志描述', text: '{log_content}', width: '50%'}

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


    function delLog(type) {
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
                    $.getJSON(me.rootPath + 'mz_log/delLog.data', {ids: ids, sid: me.sid}, function (json, scope) {
                        if (json.success) {
                            $.fn.alert({success: true, msg: "删除成功"});
                            LoadUser('', 1, 20);
                        } else {
                            $.fn.alert({success: true, msg: json.msg});
                        }
                    });
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
        var This = {};
        $.extend(This, rows[0]);

        me.pnl = me.flowGrid.Form({
            html: 'forms/F000001/detailLog.html', title: '日志详细信息', load: function (el) {
                var tpl = el.html();
                el.empty();
                $(utils.replaceTpl(tpl, This)).appendTo(el);
            }, click: function (e) {
                InitLeftToolbar(me.flowTool.parent());
                LoadUser('', 1, 25);
            }
        });
    }


    function isDeletedUser() {
        alert('未开发')
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
        me.searchTool = $('<div style="width:100%;float:left;margin-top: 10px;" ></div>').appendTo(el);

        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);

        me.flowTool.ToolBar(toolConfig);

        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);

        me.flowbox = me.flowform.iBox({
            layout: 'right',
            click: function (e) {
                LoadUser(e.text, 1, 20);
            }, height: 220, html: 'forms/F000002/addUser.html', load: function (e) {

            }
        });
        me.flowGrid = $('<div style="width:100%;float:left;background: white;" ></div>').appendTo(el);

        LoadUser('', 1, 25);

    }

    function LoadUser(keyword, index, size) {
        var ps = {
            word: keyword || '',
            beginTime: '',
            endTime: '',
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

        $.getJSON(me.rootPath + 'mz_log/getList.data', ps, function (js, scope) {
            me.flowTool.PageBar(pageConfig, js);
            config.data = js.rows;
            me.dataGrid = me.flowGrid.iwfGrid(config);
        });

    }

    var toolConfig = {
        data: [
            {
                title: '删除消费', text: '删除', key: 'mycost_b', click: function (e) {
                delLog(e);
            }
            },
            {
                title: '查看消费', text: '详细', key: 'mycost_d', click: function (e) {
                DetailUser(e);
            }
            }
        ]
    };


    function flash(args, tab) {
        tab.c.empty();
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);

            InitLeftToolbar(temp);

            var e_search = me.searchTool;
            e_search.load('forms/F000001/searchTool_Log.html', function (e) {

                e_search.find('.starttime').each(function () {
                    laydate.render({
                        elem: this,
                        trigger: 'click',
                        format: 'yyyy-MM-dd',
                        type: 'datetime',
                        theme: 'molv'
                    });
                });
                e_search.find('.endtime').each(function () {
                    laydate.render({
                        elem: this,
                        trigger: 'click',
                        format: 'yyyy-MM-dd',
                        type: 'datetime',
                        theme: 'molv'
                    });
                });

                e_search.find('#search').on('click', function () {

                    var starttime = '';
                    var endtime = '';

                    if (e_search.find('.starttime').val() != null)
                        starttime = e_search.find('.starttime').val();
                    if (e_search.find('.endtime').val() != null)
                        endtime = e_search.find('.endtime').val();


                    var ps = {
                        userId: e_search.find('.userId').val(),
                        index: 1,
                        size: 20,
                        keyword: me.flowbox.find(':input').val(),
                        ip: e_search.find('.ip').val(),
                        beginTime: starttime,
                        endTime: endtime
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


                    $.getJSON(me.rootPath + 'mz_log/getList.data', ps, function (js, scope) {
                        me.flowTool.PageBar(pageConfig, js);
                        config.data = js.rows;
                        me.dataGrid = me.flowGrid.iwfGrid(config);
                    });

                });


            });

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
