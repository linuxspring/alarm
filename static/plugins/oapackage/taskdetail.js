IWF.plugins['taskdetail'] = function () {

    var me = this;
    var nav = {
        icon: 'icon-calendar',
        title: '任务详情',
        a: 'taskdetail',
        b: 'taskdetail',
        index: 3,
        canClose: true
    };

    var config = {


        linkclick: function (sender, data) {
            var tplTd = '<td>{name}</td><td>{userid}</td><td>{position}</td><td>{tel}</td><td>{email}</td><td>{extattr}</td>';
            //LoadEpInfo(data);
            GetGoodsByEpId(me.epItemListEl, 1, 25, data);
        },
        rowclick: function (sender) {
            alert(sender.data);
        }
    };

    function collectionParams() {
        // var a = me.options.userInfo.username;
        // return {userid:me.options.userInfo.username};user_id
        return {
            userid: me.options.userInfo.autoid
        };
        //return {id:"19",proeccess:90};
        //return [{id:"",proeccess:80,name:"TEST--2",openid:"1",ownerid:"2",pid:23,rate:50},{id:"",proeccess:80,name:"TEST--2",openid:"1",ownerid:"2",pid:23,rate:50}];
        //	return {mainTask:{id:"",proeccess:80,name:"TEST--2",openid:"1",ownerid:"2",pid:23,rate:50},assignTask:[{}]};
    }

    function getJson(id, username) {
        var result = {};

        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            url: me.rootPath + 'task/getLevel.data',
            data: {id: id, username: username},
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

    function initTaskDetail(el, id, username) {


        el.load('forms/F000003/detailTask.html', function (e) {
            var aa = el.find('#canvas');

            var labelType, useGradients, nativeTextSupport, animate;
            init();

            (function () {
                var ua = navigator.userAgent, iStuff = ua.match(/iPhone/i)
                        || ua.match(/iPad/i), typeOfCanvas = typeof HTMLCanvasElement,
                    nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
                    textSupport = nativeCanvasSupport
                        && (typeof document.createElement('canvas')
                            .getContext('2d').fillText == 'function');
                //I'm setting this based on the fact that ExCanvas provides text support for IE
                //and that as of today iPhone/iPad current text support is lame
                labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native'
                    : 'HTML';
                nativeTextSupport = labelType == 'Native';
                useGradients = nativeCanvasSupport;
                animate = !(iStuff || !nativeCanvasSupport);
            })();

            function init() {
                //init data

                //var json ={"checked":false,"children":[{"checked":false,"children":[{"checked":false,"children":[],"data":{"proeccess":" 100.00%","title":"Test-?????","level":"???","manager":"administrator","plan_endtime":"2018-09-28 00:00:00"},"id":"182","parent":true,"parentId":"180","state":"open"}],"data":{"proeccess":" 100.00%","title":"Test-?????","level":"???","manager":"administrator","plan_endtime":"2018-08-24 00:00:00"},"id":"180","parent":true,"parentId":"179","state":"open"},{"checked":false,"children":[],"data":{"proeccess":" 2.00%","title":"Test-?????","level":"???","manager":"??","plan_endtime":"2018-08-31 00:00:00"},"id":"181","parent":true,"parentId":"179","state":"open"}],"data":{"proeccess":" 64.00%","title":"Test-?????","level":"???","manager":"administrator","plan_endtime":"2019-06-01 00:00:00"},"id":"179","parent":false,"parentId":"","state":"open"};							//Create a new ST instance
                var json = getJson(id, username);


                var st = new $jit.ST(
                    {
                        //id of viz container element
                        injectInto: 'infovis',
                        //set duration for the animation
                        duration: 400,
                        //set animation transition type
                        transition: $jit.Trans.Quart.easeInOut,
                        //set distance between node and its children
                        levelDistance: 50,
                        //(boolean) Default’s true.  Whether to show the entire tree when loaded or just the number of levels specified by levelsToShow.
                        constrained: false,
                        //(number) Default’s 2.  The number of levels to show for a subtree.  This number is relative to the selected node.
                        levelsToShow: 10,
                        //enable panning
                        Navigation: {
                            enable: true,
                            panning: true
                        },
                        // set chart dirction
                        orientation: "left",
                        //set node and edge styles
                        //set overridable=true for styling individual
                        //nodes or edges
                        Node: {
                            height: 180,
                            width: 300,
                            type: 'rectangle',
                            // color: '#ccffcc',
                            overridable: true,

                        },

                        Edge: {
                            type: 'bezier',
                            overridable: true
                        },

                        onBeforeCompute: function (node) {
                            // Log.write("loading " + node.name);

                        },

                        onAfterCompute: function () {
                            //Log.write("done");
                        },

                        //This method is called on DOM label creation.
                        //Use this method to add event handlers and styles to
                        //your node.
                        onCreateLabel: function (label, node) {


                            label.id = node.id;
                            if (node.data.title.length > 34)
                                node.data.title = node.data.title.substring(0, 34) + ".....";
                            if (node.data.remark.length > 34)
                                node.data.remark = node.data.remark.substring(0, 34) + ".....";
                            //var level = ['第一层','第二层','第三层','第四层','第五层','第六层'];
                            var wrap = '<div class="wrap" style="padding:10px">'
                                + '<div >单号：<span class="biaoti" >' + node.data.autoid + '</span></div>'
                                + '<div >级别：<span class="biaoti" >' + node.data.level + '</span></div>'
                                + '<div >标题：<span class="neirong" >' + node.data.title + '</span></div>'
                                + '<div >任务：<span class="neirong" >' + node.data.remark + '</span></div>'
                                + '<div >负责人：<span class="neirong" >' + node.data.manager + '</span></div>'
                                + '<div >完成进度：<span class="neirong" >' + node.data.proeccess + '</span></div>'
                                + '<div >截止时间：<span class="neirong" >' + node.data.plan_endtime + '</span></div>'
                                + '</div>';
                            if (node.data.level != '一级')
                                wrap = '<div class="wrap" style="padding:10px">'
                                    + '<div >单号：<span class="biaoti" >' + node.data.autoid + '</span></div>'
                                    + '<div >级别：<span class="biaoti">' + node.data.level + '</span></div>'
                                    + '<div >子任务：<span class="neirong">' + node.data.remark + '</span></div>'
                                    + '<div >负责人：<span class="neirong">' + node.data.manager + '</span></div>'
                                    + '<div >截止时间：<span class="neirong">' + node.data.plan_endtime + '</span></div>'
                                    + '<div >完成进度：<span class="neirong">' + node.data.proeccess + '</span></div>'
                                    + '<div >任务完成情况：<span class="neirong">' + node.data.comments + '</span></div>'
                                    + '</div>';
                            // var $wrap = $(wrap);


                            //  $wrap.find('.secondLevel').text(node.name);
                            //$wrap.find('.level').text(level[node._depth])
                            // $(label).append($wrap);
                            var $wrap = $(wrap).appendTo($(label));

                            $wrap.css("background", node.data.color);
                            label.onclick = function () {

                                st.onClick(node.id);

                            };
                        },

                        //This method is called right before plotting
                        //a node. It's useful for changing an individual node
                        //style properties before plotting it.
                        //The data properties prefixed with a dollar
                        //sign will override the global node style properties.
                        onBeforePlotNode: function (node) {
                            //add some color to the nodes in the path between the
                            //root node and the selected node.
                            //if(node.data.realproeccess=="100")  node.data.$color = "#ccffcc";
                            // else node.data.$color = "#ff7";

                            if (node.selected) {


                            } else {
                                //delete node.data.$color;
                                //if the node belongs to the last plotted level
                                if (!node.anySubnode("exist")) {
                                    //count children number
                                    var count = 0;
                                    node
                                        .eachSubnode(function (n) {
                                            count++;
                                        });
                                    //assign a node color based on
                                    //how many children it has

                                    //node.data.$color = [
                                    //     '#fff', '#ccffcc',
                                    //    '#ccffcc', '#ccffcc',
                                    //   '#ccffcc', '#ccffcc'][count];
                                }
                            }
                        },

                        //This method is called right before plotting
                        //an edge. It's useful for changing an individual edge
                        //style properties before plotting it.
                        //Edge data proprties prefixed with a dollar sign will
                        //override the Edge global style properties.
                        onBeforePlotLine: function (adj) {
                            if (adj.nodeFrom.selected
                                && adj.nodeTo.selected) {
                                //adj.data.$color = "#333";
                                adj.data.$lineWidth = 3;
                            } else {
                                //delete adj.data.$color;
                                delete adj.data.$lineWidth;
                            }
                        }
                    });
                //load json data
                st.loadJSON(json);
                //compute node positions and layout
                st.compute();
                //optional: make a translation of the tree
                st.geom.translate(new $jit.Complex(-200, 0),
                    "current");
                //emulate a click on the root node.
                st.onClick(st.root);
                //end
                //Add event handlers to switch spacetree orientation.

            }

            //me.unitCmb = e.find('#unit').ComboBox({ data : me.ds['unit'], field : 'cnname', value : 'value', name : '选择单位类型' });
            //me.typeCmb= e.find('#type').ComboBox({ data : me.ds['costtype'], field : 'cnname', value : 'value', name : '选择消费类型' });
        });
    }


    function InitLeftToolbar(el) {
        el.empty();
        me.flowTool = $('<div style="height:40px;width:100%;" ></div>')
            .appendTo(el);


        me.flowGrid = $('<div style="width:100%;float:left;background: #FFF;" ></div>').appendTo(el);

    }


    function flash(args, tab) {
        tab.c.empty();

        var temp = $('<div class="row no-padding"  style="margin:0px 10px;">linkroad</div>').appendTo(tab.c);

        InitLeftToolbar(temp);
        initTaskDetail(temp, args.params.id, args.params.username);


        me.execCommand('show', {
            a: args.a
        });

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
