(function ($) {

    // var linePro = $('#lineProgress');
    // $.ajaxSetup({
    //     timeout: 30000,
    //     cache:false,
    //     crossDomain:true,
    //     xhrFields: {
    //         withCredentials: true // 前端设置是否带cookie
    //     },
    //     error:function (xhr, status, e) {
    //        
    //     },
    //     complete:function (xhr, status) {
    //         //linePro.css('width',  "100%")
    //         linePro.hide();
    //         var sessionStatus = xhr.getResponseHeader('sessionstatus');
    //         if(sessionStatus == 'timeout') {
    //             var top = getTopWinow();
    //             var yes = confirm('由于您长时间没有操作, session已过期, 请重新登录.');
    //             if (yes) {
    //                 top.location.href = './logout';
    //                 //document.location.href = "index.html";
    //             }
    //         }
    //     },
    //     beforeSend:function (xhr) {
    //         xhr.withCredentials = true;
    //         xhr.setRequestHeader("isAjax", "isAjax-json");
    //         //xhr.setRequestHeader("isAjax", "isAjax-json");
    //         linePro.show();
    //         linePro.lineProgress();
    //     }
    // });
    /**
     * 在页面中任何嵌套层次的窗口中获取顶层窗口
     * @return 当前页面的顶层窗口对象
     */
    function getTopWinow() {
        var p = window;
        while (p != p.parent) {
            p = p.parent;
        }
        return p;
    }

    $.fn.lineProgress = function (options) {
        var me = $(this);
        $('#lineProgress').removeClass('done');
        var el = $({property: 0});
        $({property: 0}).animate({property: 100}, {
            //duration: 3000,
            step: function () {
                var percentage = Math.round(this.property);
                $('#lineProgress').css('width', percentage + "%");
                if (percentage == 100) {
                    $('#lineProgress').addClass("done");//完成，隐藏进度条

                }
            }
        });
        return me;
    }

    $.fn.Dialog = function (options) {
        var tpl = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
            + '<h4 class="modal-title">{title}</h4></div><div class="modal-body"></div><div class="modal-footer">'
            + '<button type="submit" id="btnYes" class="btn btn-primary">确定</button>'
            + '<a type="button" id="btnNo" class="btn btn-default" data-dismiss="modal">取消</a>'
            + '</div></div></div></div>';

        var me = $(utils.replaceTpl(tpl, options)).appendTo(this);
        //me.attr('id', utils.guid());
        if (options.width) me.find('.modal-dialog').width(options.width);
        if (options.height) me.find('.modal-dialog').height(options.height);
        me.modal({
            backdrop: false
        });

        function CloseWin(sender) {
            me.opts.click(sender);
            if (!me.opts.validate)
                me.remove();
        }

        me.find('#btnYes').bind('click', {ok: true}, CloseWin);
        me.find('#btnNo').bind('click', {ok: false}, CloseWin);
        me.find('.close').bind('click', {ok: false}, CloseWin);
        var defaults = {
            //click: function (sender) { }
        };

        me.opts = $.extend(defaults, options);
        me.body = me.find('.modal-body').css('padding-top', 0);
        if (me.opts.html) {
            me.body.load(me.opts.html, function (e) {
                me.opts.load(me.body);
            });
        }
        if (me.opts.tpl) {
            me.body = $(me.opts.tpl).appendTo(me.body);
            me.opts.load(me.body);
        }

        return me;
    }

    $.fn.validate = function (options) {
        var me = this;
        var defaults = {
            //click: function (sender) { }
        };
        me.opts = $.extend(defaults, options);

        var ins = this.find('input[type=text]');
        var ips = this.find('input[type=password]');
        var ras = this.find('input[type="radio"]');
        var chs = this.find('input[type="checkbox"]');
        var txts = this.find('textarea');
        var res = [];
        var pass = [], group = [], rasGroup = {};

        ips.bind('blur', function (e) {
            var obj = $(this);
            var validateType = obj.attr("validate");
            //if(valid(validateType,obj)){

            //}
        });

        function startValidate() {
            for (var i = 0; i < ins.length; i++) {
                var obj = $(ins[i]);
                var validateType = obj.attr("validate");
                if (utils.isEmptyObject(validateType)) {
                } else {
                    if (valid(validateType, obj)) {
                        break;
                    }
                }
            }
            for (var i = 0; i < txts.length; i++) {
                var obj = $(txts[i]);
                var validateType = obj.attr("validate");
                if (utils.isEmptyObject(validateType)) {
                } else {
                    if (valid(validateType, obj)) {
                        break;
                    }
                }
            }
            for (var i = 0; i < ips.length; i++) {
                var obj = $(ips[i]);
                var validateType = obj.attr("validate");
                if (utils.isEmptyObject(validateType)) {
                } else {
                    if (valid(validateType, obj)) {
                        break;
                    }
                }
            }
            for (var i = 0; i < ras.length; i++) {
                var obj = $(ras[i]);
                var validateType = obj.attr("validate");
                if (utils.isEmptyObject(validateType)) {
                } else {
                    if (!rasGroup[validateType]) {
                        rasGroup[validateType] = [];
                    }
                    rasGroup[validateType].push({value: obj.prop('checked'), el: obj, msg: obj.attr('msg')})
                }
            }
            for (var p in rasGroup) {
                groupValueNotRadio(rasGroup[p]);
            }
            if (group.length > 0) {
                groupValueNotEmpty(group);
            }
            if (pass.length > 1) {
                sameValue(pass);
            }
            if (res.length == 0) {
                me.opts.click({data: res});
            }
        }

        function groupValueNotRadio(arr) {
            var isHaveValue = false;
            for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                if (obj.value) {
                    isHaveValue = true;
                    break;
                }
            }
            if (!isHaveValue) {
                var err = arr[0].msg;
                res.push({msg: err, el: arr[0].el});
                IWF.alert({succ: false, msg: err});
            }
        }

        function groupValueNotEmpty(arr) {
            var isHaveValue = false;
            for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                if (obj.value != '') {
                    isHaveValue = true;
                    break;
                }
            }
            if (!isHaveValue) {
                var err = '条件不能同时为空，致少填写一个';
                res.push({msg: err, el: arr[0].el});
                arr[0].el.focus();
                IWF.alert({succ: false, msg: err});
            }
        }

        function sameValue(arr) {
            if (arr[0].value != arr[1].value) {
                res.push({msg: '密码不一致', el: arr[1].el});
                IWF.alert({succ: false, msg: "密码不一致"});
            }
        }

        function valid(type, el) {
            var $parent = el.parent();
            var v = el.val();
            v = utils.trim(v);
            switch (type) {
                case 'password':
                    var re = new RegExp('/[\u4e00-\u9fa5]/g');

                    if (v == "" || v.length < 6 || v.length > 12) {
                        //$parent.append('<span class="formtips onError">x</span>');
                        IWF.alert({succ: false, msg: "密码不能为空且不能少于6位数，且不能大于12位数"});
                        el.focus();
                        res.push({msg: '密码不能为空且不能少于6位数', el: el});
                        return true;
                    } else if (v.match(re)) {
                        //$parent.append('<span class="formtips onError">x</span>');
                        return IWF.alert({succ: false, msg: "密码不能包函中文"});
                    } else {
                        var okMsg = '输入正确';

                        //$parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
                    }
                    pass.push({value: v, el: el});
                    break;
                case 'email':

                    break;
                case 'code':

                    var re = new RegExp('/[\u4e00-\u9fa5]/g');
                    if (/[\u4e00-\u9fa5]/g.test(v)) {
                        el.focus();
                        IWF.alert({succ: false, msg: "密码不能包函中文"});
                        res.push({msg: '密码不能包函中文', el: el});
                        return true;
                    }
                    group.push({value: v, el: el});
                    break;
                case 'name':
                    group.push({value: v, el: el});
                    break;
                case 'selectone':
                    if (v == "") {
                        IWF.alert({succ: false, msg: "必须选择"});
                        res.push({msg: '必须选择', el: el});
                        return true;
                    }
                    break;
                case 'notempty':
                    if (v == "") {
                        el.focus();
                        var err = el.attr('msg');
                        if (err == '' || err == null) {
                            err = "该项不能为空";
                        }
                        IWF.alert({succ: false, msg: err});
                        res.push({msg: err, el: el});
                        return true;
                    }
                    break;
            }

        }

        startValidate();
        return me;
    }

    $.fn.iwfDate = function (options) {
        this.empty();

        var me = this;// $(utils.replaceTpl(tableTpl, options)).appendTo(this);
        var defaults = {
            click: function (sender) {

            }
        };
        me.opts = $.extend(defaults, options);
        me.opts.weekTitle = ['日', '一', '二', '三', '四', '五', '六'];
        me.opts.monthTitle = ['日', '一', '二', '三', '四', '五', '六'];
        var date = new Date(me.opts.year, me.opts.month - 1, me.opts.day);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = new Date(year, month + 1, 0);
        var dn = day.getDate();
        var day2 = new Date(year, month + 2, 0);
        var dn2 = day2.getDate();

        var dFirst = new Date(year, month + 1, 1).getDay();
        var fDate = date;// new Date();
        fDate.setDate(1);
        var dFirs2t = fDate.getDay();
        //alert(dFirst+"test:="+dFirs2t);
        var d = new Date().getDay();
        var currentDay = formatNowDate(new Date());//new Date().getDate();
        //alert(currentDay);
        var str = "今天是星期" + me.opts.weekTitle[d];


        function renderTitle(el) {
            var weekTitleEl = $('<div class="weekTitle"/>').appendTo(me);
            var weekTitleULEl = $('<ul />').appendTo(weekTitleEl);
            for (var i = 0; i < me.opts.weekTitle.length; i++) {
                var week = me.opts.weekTitle[i];
                var ds = {title: week}
                var tpl = '<li class="weekTitle-item">{title}</li>';
                var liEl = $(utils.replaceTpl(tpl, ds)).appendTo(weekTitleULEl);
            }
        }

        function renderPrevMonthDayLi(dayNumber, start, monthNumber, curDayNo) {
            var weekTitleEl = $('<div class="prevMonth"></div>').appendTo(me);
            var monthTitleEl = $('<div class="monthTitle">' + monthNumber + ' 月</div>').appendTo(weekTitleEl);
            var weekTitleULEl = $('<ul />').appendTo(weekTitleEl);
            for (var i = 0 - start; i < dayNumber; i++) {
                var item = i + 1;
                var ds = {title: item, type: '上夜班'}
                var tpl = '<li ><div class="sunDate">{title}</div><div class="lunarDate">{lunarDayTitle}</div><div class="bian">{type}</div></li>';
                if (item == curDayNo) {
                    ds.title = '今天';
                    ds.type = '白班';
                    tpl = '<li class="active"><div class="sunDate">{title}</div><div class="lunarDate">{lunarDayTitle}</div><div class="bian">{type}</div></li>';
                }
                if (i < 0) {
                    tpl = '<li ></li>';
                }

                var calaInstance = new cala();
                var meDate = calaInstance.GetMyLunaerDay(year, month, i + start);
                ds.lunarDayTitle = meDate.lunarDayTitle;
                var liEl = $(utils.replaceTpl(tpl, ds)).appendTo(weekTitleULEl);
                if (item < curDayNo) {
                    liEl.addClass("datePass");
                    liEl.bind('click', ds, function (e) {
                        me.opts.click({day: i, data: e.data, isPass: true});
                    });
                } else {
                    liEl.bind('click', ds, function (e) {
                        $(this).addClass('active').siblings().removeClass('active');
                        me.opts.click({day: i, data: e.data, isPass: true});
                    });
                }

            }
        }

        function renderPrevMonthDayLiBian(dayNumber, start, monthNumber, curDayNo) {
            var weekTitleEl = $('<div class="prevMonth"></div>').appendTo(me);
            var monthTitleEl = $('<div class="monthTitle">' + year + '年' + monthNumber + ' 月</div>').appendTo(weekTitleEl);
            var weekTitleULEl = $('<ul />').appendTo(weekTitleEl);
            for (var i = 0 - start; i < dayNumber + (42 - dayNumber - start); i++) {
                var item = i + 1;
                var tempDate = new Date(year, month, item);

                var ds = {
                    title: item,
                    type: '-1',
                    sunDate: new Date(year, month, item),
                    row: null,
                    sunDateFormat: ''
                }
                ds = dataVsDate('schedule', ds);
                ds.title = tempDate.getDate();
                var tpl = '<li ><div class="sunDate">{title}</div><div class="lunarDate">{lunarDayTitle}</div><div class="bian">{bianCi}</div></li>';
                if (ds.sunDateFormat == curDayNo) {
                    ds.title = '今天';
                    //ds.type='白班';
                    tpl = '<li class="today"><div class="sunDate">{title}</div><div class="lunarDate">{lunarDayTitle}</div><div class="bian">{bianCi}</div></li>';
                }
                if (i < 0) {
                    //tpl = '<li ></li>';
                }

                if (item > dayNumber) {
                    //item=item-dayNumber;
                    //ds.title=item-dayNumber;
                }
                //alert(new Date(year, month, i+start));
                //var calaInstance = new cala();

                var meDate = new cala2050().GetMyLunaerDay(year, month, item); //calaInstance.GetMyLunaerDay(year, month + 1, item);
                ds.lunarDayTitle = meDate.lunarDayTitle;
                var liEl = $(utils.replaceTpl(tpl, ds)).appendTo(weekTitleULEl);
                if (item < curDayNo) {
                    liEl.addClass("datePass");
                    liEl.bind('click', ds, function (e) {
                        me.opts.click({day: i, data: e.data, isPass: true});
                    });
                } else {
                    if (ds.isMyself) {
                        liEl.addClass('myself-bain');
                    }
                    liEl.bind('click', ds, function (e) {
                        $(this).addClass('active').siblings().removeClass('active');
                        me.opts.click({day: i, data: e.data, isPass: true});
                    });
                }

            }
        }

        function renderPrevMonthDayLiBian2(dayNumber, start, monthNumber, curDayNo) {
            var weekTitleEl = $('<div class="prevMonth"></div>').appendTo(me);
            var monthTitleEl = $('<div class="monthTitle">' + monthNumber + ' 月</div>').appendTo(weekTitleEl);
            var weekTitleULEl = $('<ul />').appendTo(weekTitleEl);
            for (var i = 0 - start; i < dayNumber + (42 - dayNumber - start); i++) {
                var item = i + 1;
                var tempDate = new Date(year, month, item);

                var ds = {title: item, type: '-1', sunDate: new Date(year, month, i), row: null, sunDateFormat: ''}
                ds = dataVsDate('schedule', ds);
                //ds.title=tempDate.getDate();
                var tpl = '<li ><div class="sunDate">{title}</div><div class="lunarDate">{lunarDayTitle}</div><div class="bian">{bianCi}</div></li>';
                if (item == curDayNo) {
                    ds.title = '今天';
                    //ds.type='白班';
                    tpl = '<li class="today"><div class="sunDate">{title}</div><div class="lunarDate">{lunarDayTitle}</div><div class="bian">{bianCi}</div></li>';
                }
                if (i < 0) {
                    tpl = '<li ></li>';
                }

                if (item > dayNumber) {
                    //item=item-dayNumber;
                    ds.title = item - dayNumber;
                }
                //alert(new Date(year, month, i+start));
                var calaInstance = new cala();
                var meDate = calaInstance.GetMyLunaerDay(year, month, i + start);
                ds.lunarDayTitle = meDate.lunarDayTitle;
                var liEl = $(utils.replaceTpl(tpl, ds)).appendTo(weekTitleULEl);
                if (item < curDayNo) {
                    liEl.addClass("datePass");
                    liEl.bind('click', ds, function (e) {
                        me.opts.click({day: i, data: e.data, isPass: true});
                    });
                } else {
                    if (ds.isMyself) {
                        liEl.addClass('myself-bain');
                    }
                    liEl.bind('click', ds, function (e) {
                        $(this).addClass('active').siblings().removeClass('active');
                        me.opts.click({day: i, data: e.data, isPass: true});
                    });
                }

            }
        }

        function addDate(date, days) {
            if ($.isEmptyObject(days)) {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }

        function formatNowDate(date) {
            var date = new Date(date);
            //date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }

        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        function getFormatDate(arg) {
            if (arg == undefined || arg == '') {
                return '';
            }
            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }
            return re;
        }

        function dataVsDate(field, pDate) {
            pDate.sunDateFormat = formatNowDate(pDate.sunDate);
            for (var i = 0; i < me.opts.data.length; i++) {
                var it = me.opts.data[i];
                if (it[field] == pDate.sunDateFormat) {
                    pDate.type = it.type;
                    pDate.row = it;
                    if (it.userid == me.opts.userid) {
                        pDate.isMyself = true;
                    }
                    break;
                }
            }
            for (var i = 0; i < me.opts.dict.length; i++) {
                var it = me.opts.dict[i];
                if (it.key == pDate.type) {
                    pDate.bianCi = it.value;
                    break;
                }
            }
            return pDate;
        }

        function renderNextMonthDayLi(dayNumber, start, monthNumber) {
            var weekTitleEl = $('<div class="nextMonth"></div>').appendTo(me);
            var monthTitleEl = $('<div class="monthTitle">' + monthNumber + ' 月</div>').appendTo(weekTitleEl);
            var weekTitleULEl = $('<ul />').appendTo(weekTitleEl);
            for (var i = 0 - start; i < dayNumber; i++) {
                var week = i + 1;
                var ds = {title: week}
                var tpl = '<li >{title}</li>';
                if (i < 0) {
                    tpl = '<li ></li>';
                }
                var liEl = $(utils.replaceTpl(tpl, ds)).appendTo(weekTitleULEl);
                liEl.bind('click', function (e) {
                    $(this).addClass('active').siblings().removeClass('active');
                })
            }
        }


        function holiday(monthNo, dateNo) {
            var holiday = '';
            if ((monthNo == 0) && (dateNo == 1)) holiday = "元旦";
            if ((monthNo == 1) && (dateNo == 14)) holiday = "情人节";
            if ((monthNo == 2) && (dateNo == 8)) holiday = "妇女节";
            if ((monthNo == 2) && (dateNo == 12)) holiday = "植树节";
            if ((monthNo == 3) && (dateNo == 1)) holiday = "愚人节";
            if ((monthNo == 4) && (dateNo == 1)) holiday = "劳动节";
            if ((monthNo == 4) && (dateNo == 4)) holiday = "青年节";
            if ((monthNo == 5) && (dateNo == 1)) holiday = "儿童节";
            if ((monthNo == 7) && (dateNo == 1)) holiday = "建军节";
            if ((monthNo == 8) && (dateNo == 10)) holiday = "老师节";
            if ((monthNo == 9) && (dateNo == 1)) holiday = "国庆节";
            if ((monthNo == 11) && (dateNo == 24)) holiday = "平安夜";
            if ((monthNo == 11) && (dateNo == 25)) holiday = "圣诞节";
            return holiday;
        }

        var cala2050 = function () {
            var lunarInfo = new Array(
                0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
                0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
                0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
                0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
                0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
                0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
                0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
                0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
                0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
                0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
                0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
                0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
                0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
                0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
                0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
                //add by wzy
                0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
                0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
                0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
                0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
                0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
                0x0d520
            )

            var Animals = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
            var Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸");
            var Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
//            var now = new Date();
//            var SY = now.getYear();
//            var SM = now.getMonth();
//            var SD = now.getDate();

            function cyclical(num) {
                return (Gan[num % 10] + Zhi[num % 12])
            } //==== 传入 offset 传回干支, 0=甲子
//==== 传回农历 y年的总天数
            function lYearDays(y) {
                var i, sum = 348
                for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
                return (sum + leapDays(y))
            }

//==== 传回农历 y年闰月的天数
            function leapDays(y) {
                if (leapMonth(y))  return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
                else return (0)
            }

//==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
            function leapMonth(y) {
                return (lunarInfo[y - 1900] & 0xf)
            }

//====================================== 传回农历 y年m月的总天数
            function monthDays(y, m) {
                return ( (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29 )
            }

//==== 算出农历, 传入日期物件, 传回农历日期物件
//     该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
            function Lunar(objDate) {
                var i, leap = 0, temp = 0
                var baseDate = new Date(1900, 0, 31)
                var offset = (objDate - baseDate) / 86400000

                this.dayCyl = offset + 40
                this.monCyl = 14

                for (i = 1900; i < 2100 && offset > 0; i++) {
                    temp = lYearDays(i)
                    offset -= temp
                    this.monCyl += 12
                }
                if (offset < 0) {
                    offset += temp;
                    i--;
                    this.monCyl -= 12
                }

                this.year = i
                this.yearCyl = i - 1864

                leap = leapMonth(i) //闰哪个月
                this.isLeap = false

                for (i = 1; i < 13 && offset > 0; i++) {
                    //闰月
                    if (leap > 0 && i == (leap + 1) && this.isLeap == false) {
                        --i;
                        this.isLeap = true;
                        temp = leapDays(this.year);
                    }
                    else {
                        temp = monthDays(this.year, i);
                    }

                    //解除闰月
                    if (this.isLeap == true && i == (leap + 1)) this.isLeap = false

                    offset -= temp
                    if (this.isLeap == false) this.monCyl++
                }

                if (offset == 0 && leap > 0 && i == leap + 1)
                    if (this.isLeap) {
                        this.isLeap = false;
                    }
                    else {
                        this.isLeap = true;
                        --i;
                        --this.monCyl;
                    }

                if (offset < 0) {
                    offset += temp;
                    --i;
                    --this.monCyl;
                }

                this.month = i
                this.day = offset + 1
            }

            function YYMMDD() {
                var cl = '<font color="green" STYLE="font-size:13pt;">';
                if (now.getDay() == 0) cl = '<font color="#c00000" STYLE="font-size:13pt;">';
                if (now.getDay() == 6) cl = '<font color="green" STYLE="font-size:13pt;">';
                return (cl + SY + '年' + (SM + 1) + '月' + '</font>');
            }

            function weekday() {
                var day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
                var cl = '<font color="green" STYLE="font-size:9pt;">';
                if (now.getDay() == 0) cl = '<font color="green" STYLE="font-size:9pt;">';
                if (now.getDay() == 6) cl = '<font color="red" STYLE="font-size:9pt;">';
                return (cl + day[now.getDay()] + '</font>');
            }

            //==== 中文日期
            function cDay(m, d) {
                var nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
                var nStr2 = new Array('初', '十', '廿', '卅', '　');
                var s;
                if (m > 10) {
                    s = '十' + nStr1[m - 10]
                } else {
                    s = nStr1[m]
                }
                s += '月'
                switch (d) {
                    case 10:
                        s += '初十';
                        break;
                    case 20:
                        s += '二十';
                        break;
                    case 30:
                        s += '三十';
                        break;
                    default:
                        s += nStr2[Math.floor(d / 10)];
                        s += nStr1[d % 10];
                }
                return (s);
            }


            this.GetMyLunaerDay = function (yy, mm, dd) {
                if (yy > 2100) {
                    //alert('最大年份为2100年');
                    yy = 2100;
                }
                var sDObj = new Date(yy, mm, dd);
                var lDObj = new Lunar(sDObj);
//                var tt = '【' + Animals[(SY - 4) % 12] + '】' + cyclical(lDObj.monCyl) + '月 ' + cyclical(lDObj.dayCyl++) + '日';
//                tt += cyclical(SY - 1900 + 36) + '年 ' + cDay(lDObj.month, lDObj.day);
//                var str = tt;
                var meDay = lDObj.day;
                var meDate = {
                    year: yy,
                    month: mm,
                    day: dd,
                    lunarYear: lDObj.year,
                    luanerMonth: lDObj.month,
                    lunarDay: lDObj.day
                };
                meDate.lunarDayTitle = (meDay < 11) ? "初" : ((meDay < 20) ? "十" : ((meDay < 30) ? "廿" : "三十"));
                if (meDay % 10 != 0 || meDay == 10) {
                    var numString = "一二三四五六七八九十";
                    meDate.lunarDayTitle += numString.charAt((meDay - 1) % 10);
                }
                return meDate;
            }
        }


        renderTitle();
        renderPrevMonthDayLiBian(dn, dFirs2t, month + 1, currentDay);
        //renderPrevMonthDayLi(dn, dFirs2t, month + 1, currentDay);
        //renderNextMonthDayLi(dn2, dFirst, month + 2);

        return me;
    }

})(jQuery);