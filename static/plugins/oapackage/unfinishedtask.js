IWF.plugins['unfinishedtask'] = function () {

    var me = this;
    var nav = {
        icon: 'icon-calendar',
        title: '未完成任务',
        a: 'unfinishedtask',
        b: 'unfinishedtask',
        index: 3,
        canClose: true
    };
    var tplBar = '<div class="progress" style="width:80px;margin-bottom: 0px;background-color: #9f9f9f">'
        + '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: {proeccess}">'
        + '<span >{proeccess}</span>'
        + '</div>'
        + '</div>';
    var config = {

        columns: [{
            title: '<input type="checkbox" />',
            text: '<input type="checkbox" />',
            width: '3%',
            click: true
        }, {
            title: '编号',
            text: '{autoid}',
            width: '7%',
            sortable: true
        }, {
            title: '级别',
            text: '{levels}',
            width: '5%'
        }, {
            title: '任务标题',
            text: '{name}',
            width: '15%'
        }, {
            title: '任务内容',
            text: '{remark}',
            width: '20%'
        }, {
            title: '下发人',
            text: '{openid}',
            width: '10%'
        }, {
            title: '计划完成时间',
            text: '{plan_endtime}',
            width: '13%',
            sortable: true
        }, {
            title: '任务状态',
            text: '{status}',
            width: '10%'
        }, {
            title: '完成进度',
            text: tplBar,
            width: '10%',
            sortable: true
        },

        ],
        linkclick: function (sender, data) {
            var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            //LoadEpInfo(data);
            GetGoodsByEpId(me.epItemListEl, 1, 25, data);
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
            switch (index) {
                case 1:
                    sort = 'id';
                    break;
                //case 2: sort='levels' ;  break;
                //case 3: sort='name';break;
                //case 4: sort='remark';break;
                //case 5: sort='manager';break;
                case 6:
                    sort = 'plan_endtime';
                    break;
                case 8:
                    sort = 'proeccess';
                    break;
                default:
                    'id';
            }

            var e_search = me.searchTool;
            if (e_search.find('.week').prop('checked') == true)
                week = 1;
            if (e_search.find('.month').prop('checked') == true)
                month = 1;
            if (e_search.find('.dept').prop('checked') == true)
                dept = 1;
            if (e_search.find('.group').prop('checked') == true)
                group = 1;
            if (e_search.find('.starttime').val() != null)
                starttime = e_search.find('.starttime').val();
            if (e_search.find('.endtime').val() != null)
                endtime = e_search.find('.endtime').val();


            var search = {
                userid: me.options.userInfo.autoid,
                weekpoint: week,
                monthpoint: month,
                ownerid: "",
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
                type: 5
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

    function taskDetail(e) {
        var arr = me.dataGrid.getSelected();
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
        This.username = "";
        var data = {icon: 'icon-sitemap', color: 'icon-red', 'a': 'taskdetail', 'b': 'taskdetail', params: This};
        var meTaskDetail = window.framework;
        meTaskDetail.execCommand('go', data);
    }

    function collectionParams() {

        return {
            userid: '',
            weekpoint: 0,
            monthpoint: 0,
            deptpoint: 0,
            grouppoint: 0,
            ownerid: '',
            starttime: '',
            endtime: '',
            sort: 'id',
            desc: 'true'
        };

    }

    function LoadLitchi(keyword, index, size) {
        var ps = {

            index: index,
            size: size,
            keyword: keyword,
            json: iwfTool.encryptByDES(utils.fromJSON(collectionParams())),
            type: 5
            //1我的任务;2我分派;3历史;4全部;5未完成
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
    }


    var toolConfig = {
        data: [{
            title: '任务详情',
            text: '任务详情',
            key: 'mycost_b',
            click: function (e) {
                taskDetail(e);
            }
        }]
    };

    function InitLeftToolbar(el) {
        el.empty();
        me.searchTool = $('<div style="width:100%;float:left;margin-top: 10px;" ></div>').appendTo(el);
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>').appendTo(el);
        me.flowTool.ToolBar(toolConfig);
        me.flowform = $('<div class="navbar-form navbar-left"></div>').appendTo(me.flowTool);
        me.flowbox = me.flowform.iBox({
            layout: 'right', click: function (e) {
                LoadLitchi(e.text, 1, 20);
            }, height: 220, html: 'forms/F000001/SystemSet_Ad.html', load: function (e) {

            }
        });
        me.flowGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(el);


    }

    function flash(args, tab) {
        tab.c.empty();

        var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);

        InitLeftToolbar(temp);

        var e_search = me.searchTool;
        e_search.load('forms/F000003/searchTool_His.html', function (e) {

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

            e_search.find('#search1').on('click', function () {
                var week = '';
                var month = '';
                var dept = '';
                var group = '';
                var starttime = '';
                var endtime = '';

                if (e_search.find('.week').prop('checked') == true)
                    week = 1;
                if (e_search.find('.month').prop('checked') == true)
                    month = 1;
                if (e_search.find('.dept').prop('checked') == true)
                    dept = 1;
                if (e_search.find('.group').prop('checked') == true)
                    group = 1;
                if (e_search.find('.starttime').val() != null)
                    starttime = e_search.find('.starttime').val();
                if (e_search.find('.endtime').val() != null)
                    endtime = e_search.find('.endtime').val();


                var search = {
                    userid: "",
                    weekpoint: week,
                    monthpoint: month,
                    ownerid: "",
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
                    json: utils.fromJSON(search),
                    keyword: me.flowbox.find(':input').val(),
                    type: 5
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

            });

            e_search.find('#export').on('click', function () {

                var week = '';
                var month = '';
                var dept = '';
                var group = '';
                var starttime = '';
                var endtime = '';
                if (e_search.find('.week').prop('checked') == true)
                    week = 1;
                if (e_search.find('.month').prop('checked') == true)
                    month = 1;
                if (e_search.find('.dept').prop('checked') == true)
                    dept = 1;
                if (e_search.find('.group').prop('checked') == true)
                    group = 1;
                if (e_search.find('.starttime').val() != null)
                    starttime = e_search.find('.starttime').val();
                if (e_search.find('.endtime').val() != null)
                    endtime = e_search.find('.endtime').val();

                var search = {
                    userid: "",
                    weekpoint: week,
                    monthpoint: month,
                    ownerid: "",
                    deptpoint: dept,
                    grouppoint: group,
                    starttime: starttime,
                    endtime: endtime,
                    sort: 'id',
                    desc: 'true'

                };
                var ps = {

                    keyword: me.flowbox.find(':input').val(),
                    json: utils.fromJSON(search),
                    type: 5
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

                /*$.post(me.rootPath + 'task/export.data', ps, function(js, scope) {
                 //me.flowTool.PageBar(pageConfig, js);
                 //config.data = js.rows;
                 //me.dataGrid = me.flowGrid.iwfGrid(config);

                 if(js == null || js =='')
                 return;
                 JSONToExcelConvertor(js, "任务监控"+ new Date().toLocaleString());

                 },'json');*/

                window.location.href = me.rootPath + 'task/export.data?keyword=' +
                    me.flowbox.find(':input').val() + '&json=' + utils.fromJSON(search) + '&type=3';


            });
        });
        //   var e_search=$(search).appendTo(tab.c);


        LoadLitchi('', 1, 20);


        me.execCommand('show', {
            a: args.a
        });

    }

    function getAssignee(el, name, keyword) {
        var assignerUrl = me.rootPath + 'user/findbyfullname.data';


        $.post(assignerUrl, {fullname: ''}, function (json, scope) {


            var data = json;
            el.find('#assignee').empty();
            el.find('#assignee').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                el.find('#assignee').append('<option value="' + data[i].username + '">' + data[i].fullname + '</option>');
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
            data: {id: id},
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

    function JSONToExcelConvertor(JSONData, FileName) {
        //先转化json  
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var excel = '<table>';

        //设置表头  
        //var row = "<tr>";  
        //for (var i = 0, l = ShowLabel.length; i < l; i++) {  
        //     row += "<td>" + ShowLabel[i].value + '</td>';
        // }

        excel += '<td>' + '编号' + '</td>';
        excel += '<td>' + '级别' + '</td>';
        excel += '<td>' + '任务标题' + '</td>';
        excel += '<td>' + '任务内容' + '</td>';
        excel += '<td>' + '下发人' + '</td>';
        excel += '<td>' + '计划完成时间' + '</td>';
        excel += '<td>' + '任务状态' + '</td>';
        excel += '<td>' + '完成进度' + '</td>';

        // 设置数据
        for (var i = 0; i < arrData.length; i++) {
            var row = "<tr>";

            //for (var index in arrData[i]) {  
            var value = arrData[i].autoid === "." ? "" : arrData[i].autoid;
            row += '<td>' + value + '</td>';
            value = arrData[i].level === "." ? "" : arrData[i].level;
            row += '<td>' + value + '</td>';
            value = arrData[i].name === "." ? "" : arrData[i].name;
            row += '<td>' + value + '</td>';
            value = arrData[i].remark === "." ? "" : arrData[i].remark;
            row += '<td>' + value + '</td>';
            value = arrData[i].openid === "." ? "" : arrData[i].openid;
            row += '<td>' + value + '</td>';
            value = arrData[i].plan_endtime === "." ? "" : arrData[i].plan_endtime;
            row += '<td>' + value + '</td>';
            value = arrData[i].status === "." ? "" : arrData[i].status;
            row += '<td>' + value + '</td>';
            value = arrData[i].proeccess === "." ? "" : arrData[i].proeccess;
            row += '<td>' + value + '</td>';
            //}  

            excel += row + "</tr>";
        }

        excel += "</table>";

        var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
        excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
        excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
        excelFile += '; charset=UTF-8">';
        excelFile += "<head>";
        excelFile += "<!--[if gte mso 9]>";
        excelFile += "<xml>";
        excelFile += "<x:ExcelWorkbook>";
        excelFile += "<x:ExcelWorksheets>";
        excelFile += "<x:ExcelWorksheet>";
        excelFile += "<x:Name>";
        excelFile += "任务监控";
        excelFile += "</x:Name>";
        excelFile += "<x:WorksheetOptions>";
        excelFile += "<x:DisplayGridlines/>";
        excelFile += "</x:WorksheetOptions>";
        excelFile += "</x:ExcelWorksheet>";
        excelFile += "</x:ExcelWorksheets>";
        excelFile += "</x:ExcelWorkbook>";
        excelFile += "</xml>";
        excelFile += "<![endif]-->";
        excelFile += "</head>";
        excelFile += "<body>";
        excelFile += excel;
        excelFile += "</body>";
        excelFile += "</html>";


        var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

        var link = document.createElement("a");
        link.href = uri;

        link.style = "visibility:hidden";
        link.download = FileName + ".xls";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {
                    a: args.a
                }) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });


};
