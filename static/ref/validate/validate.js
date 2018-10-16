(function ($) {

    var linePro = $('#lineProgress');
    $.ajaxSetup({
        timeout: 30000,
        cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true // 前端设置是否带cookie
        },
        error: function (xhr, status, e) {

        },
        complete: function (xhr, status) {
            //linePro.css('width',  "100%")
            linePro.hide();
            var sessionStatus = xhr.getResponseHeader('sessionstatus');
            if (sessionStatus == 'timeout') {
                var top = getTopWinow();
                var yes = confirm('由于您长时间没有操作, session已过期, 请重新登录.');
                if (yes) {
                    top.location.href = './logout';
                    //document.location.href = "index.html";
                }
            }
        },
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
            //xhr.setRequestHeader("isAjax", "isAjax-json");
            xhr.setRequestHeader("isAjax", "isAjax-json");
            linePro.show();
            linePro.lineProgress();
        }
    });
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
            }
            me.opts.load({data: res});
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
                case 'IdCard':
                    var re = new RegExp('/[\u4e00-\u9fa5]/g');
                    var err = el.attr('msg');
                    if (v == "" || v.length != 18) {
                        IWF.alert({succ: false, msg: "身份证号不能为空且为18位数"});
                        el.focus();
                        res.push({msg: '身份证号不能为空且为18位数', el: el});
                        return true;
                    } else if (v.match(re)) {
                        return IWF.alert({succ: false, msg: "身份证号不能包函中文"});
                    } else {
                        var okMsg = '输入正确';

                        //$parent.append('<span class="formtips onSuccess">'+okMsg+'</span>');
                    }
                    pass.push({value: v, el: el});
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
        var fDate = new Date();
        fDate.setDate(1);
        var dFirs2t = fDate.getDay();
        //alert(dFirst+"test:="+dFirs2t);
        var d = new Date().getDay();
        var currentDay = new Date().getDate();
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
            var monthTitleEl = $('<div class="monthTitle">' + monthNumber + ' 月</div>').appendTo(weekTitleEl);
            var weekTitleULEl = $('<ul />').appendTo(weekTitleEl);
            for (var i = 0 - start; i < dayNumber + (42 - dayNumber - start); i++) {
                var item = i + 1;
                var tempDate = new Date(year, month, item);

                var ds = {title: item, type: '-1', sunDate: new Date(year, month, i), row: null, sunDateFormat: ''}
                ds = dataVsDate('schedule', ds);
                ds.title = tempDate.getDate();
                var tpl = '<li ><div class="sunDate">{title}</div><div class="lunarDate">{lunarDayTitle}</div><div class="bian">{bianCi}</div></li>';
                if (item == curDayNo) {
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
            if (days == undefined || days == '') {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
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
            pDate.sunDateFormat = addDate(pDate.sunDate);
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

        var cala = function () {


            var tgString = "甲乙丙丁戊己庚辛壬癸";
            var dzString = "子丑寅卯辰巳午未申酉戌亥";
            var numString = "一二三四五六七八九十";
            var monString = "正二三四五六七八九十冬腊";
            var weekString = "日一二三四五六";
            var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
            var cYear, cMonth, cDay, TheDate;
            var CalendarData = new Array(100);
            var madd = new Array(12);
            CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);

            madd[0] = 0;
            madd[1] = 31;
            madd[2] = 59;
            madd[3] = 90;
            madd[4] = 120;
            madd[5] = 151;
            madd[6] = 181;
            madd[7] = 212;
            madd[8] = 243;
            madd[9] = 273;
            madd[10] = 304;
            madd[11] = 334;
            function GetBit(m, n) {
                return (m >> n) & 1;
            }

            function e2c() {
                TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
                var total, m, n, k;
                var isEnd = false;
                var tmp = TheDate.getYear();
                if (tmp < 1900) {
                    tmp += 1900;
                }
                total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
                if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
                    total++;
                }
                for (m = 0; ; m++) {
                    k = (CalendarData[m] < 0xfff) ? 11 : 12;
                    for (n = k; n >= 0; n--) {
                        if (total <= 29 + GetBit(CalendarData[m], n)) {
                            isEnd = true;
                            break;
                        }
                        total = total - 29 - GetBit(CalendarData[m], n);
                    }
                    if (isEnd) break;
                }
                cYear = 1921 + m;
                cMonth = k - n + 1;
                cDay = total;
                if (k == 12) {
                    if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                        cMonth = 1 - cMonth;
                    }
                    if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                        cMonth--;
                    }
                }
            }

            function GetcDateString() {
                var tmp = "";
                tmp += tgString.charAt((cYear - 4) % 10);
                tmp += dzString.charAt((cYear - 4) % 12);
                tmp += "(";
                tmp += sx.charAt((cYear - 4) % 12);
                tmp += ")年 ";
                if (cMonth < 1) {
                    tmp += "(闰)";
                    tmp += monString.charAt(-cMonth - 1);
                } else {
                    tmp += monString.charAt(cMonth - 1);
                }
                tmp += "月";
                tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
                if (cDay % 10 != 0 || cDay == 10) {
                    tmp += numString.charAt((cDay - 1) % 10);
                }
                return tmp;
            }

            function GetLunarDay(solarYear, solarMonth, solarDay) {
                //solarYear = solarYear<1900?(1900+solarYear):solarYear;
                if (solarYear < 1921 || solarYear > 2020) {
                    return "";
                } else {
                    solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
                    e2c(solarYear, solarMonth, solarDay);
                    return GetcDateString();
                }
            }

            var DDD = new Date();
            var yy = DDD.getFullYear();
            var mm = DDD.getMonth() + 1;
            var dd = DDD.getDate();
            var ww = DDD.getDay();
            var ss = parseInt(DDD.getTime() / 1000);
            if (yy < 100) yy = "19" + yy;
            function showCal() {
                var mestr = GetLunarDay(yy, mm, dd);
                var meDate = {year: yy, month: mm, day: dd, lunarYear: cYear, luanerMonth: cMonth, lunarDay: cDay};
                return meDate;
            }

            this.GetMyLunaerDay = function (yy, mm, dd) {
                var mestr = GetLunarDay(yy, mm, dd);
                var meDate = {year: yy, month: mm, day: dd, lunarYear: cYear, luanerMonth: cMonth, lunarDay: cDay};
                meDate.lunarDayTitle = (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
                if (cDay % 10 != 0 || cDay == 10) {
                    meDate.lunarDayTitle += numString.charAt((cDay - 1) % 10);
                }
                return meDate;
            }
            showCal();
        }


        renderTitle();
        renderPrevMonthDayLiBian(dn, dFirs2t, month + 1, currentDay);
        //renderPrevMonthDayLi(dn, dFirs2t, month + 1, currentDay);
        //renderNextMonthDayLi(dn2, dFirst, month + 2);

        return me;
    }

})(jQuery);