IWF.plugins['apprtask'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '我的待审批单', a: 'apprtask', b: 'apprtask', index: 3, canClose: true};
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
            var sort = 'id';
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


            var search = {
                ownerid: me.options.userInfo.id,

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
            ownerid: me.options.userInfo.id,
            sort: 'id',
            desc: 'true'
        };

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

        $.post(me.rootPath + 'task/apprview.data', ps, function (js, scope) {
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
                }, height: 220
            }
        );


        me.flowGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(el);

    }


    var toolConfig = {
        data: [
            {
                title: '批准', text: '批准', key: 'mycost_a', click: function (e) {
                changeJinDu(e);
            }
            },
            {
                title: '拒绝', text: '拒绝', key: 'mycost_copy', click: function (e) {
                xiaFaTask(e, 1);
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


    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });
};
