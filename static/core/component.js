// utils for crm oa sale order
var iwfTool = IWF.tool = {
    toFixed: function (v, len) {
        var fixNum = new Number(v + 1).toFixed(2);//四舍五入之前加1
        var fixedNum = new Number(fixNum - 1).toFixed(2);//四舍五入之后减1，再四舍五入一下
        return fixedNum;//弹出的数字就是正确的四舍五入结果啦
    },
    encryptByDES: function (message) {
        var key = 'ovATL3QOQmKh0WiTqhkSbg==';
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    decryptByDESModeEBC: function (ciphertext) {
        var key = 'ovATL3QOQmKh0WiTqhkSbg==';
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var result_value = decrypted.toString(CryptoJS.enc.Utf8);
        return result_value;
    },
    getCfg: function (price, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (price > arr[i].startPrice && price < arr[i].endPrice) {
                return arr[i];
            }
        }
        return arr[0];
    },
    getDict: function (arr, field, pid) {
        var t = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][field] == pid) {
                t.push(arr[i]);
            }
        }
        t.sort(function (a, b) {
            return a.id - b.id
        });
        return t;
    },
    getVDict: function (arr, field, v) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][field] == v) {
                return arr[i].cnname;
            }
        }
    },
    base64: {
        map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        decode: function (s) {
            s += '';
            var len = s.length;
            if ((len === 0) || (len % 4 !== 0)) {
                return s;
            }

            var pads = 0;
            if (s.charAt(len - 1) === this.map[64]) {
                pads++;
                if (s.charAt(len - 2) === this.map[64]) {
                    pads++;
                }
                len -= 4;
            }

            var i, b, map = base64.map, x = [];
            for (i = 0; i < len; i += 4) {
                b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i + 1)) << 12) | (map.indexOf(s.charAt(i + 2)) << 6) | map.indexOf(s.charAt(i + 3));
                x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff, b & 0xff));
            }

            switch (pads) {
                case 1:
                    b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12) | (map.indexOf(s.charAt(i)) << 6);
                    x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff));
                    break;
                case 2:
                    b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12);
                    x.push(String.fromCharCode(b >> 16));
                    break;
            }
            return unescape(x.join(''));
        }
        , encode: function (s) {
            if (!s) {
                return;
            }

            s += '';
            if (s.length === 0) {
                return s;
            }
            s = escape(s);

            var i, b, x = [], map = this.map, padchar = map[64];
            var len = s.length - s.length % 3;

            for (i = 0; i < len; i += 3) {
                b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8) | s.charCodeAt(i + 2);
                x.push(map.charAt(b >> 18));
                x.push(map.charAt((b >> 12) & 0x3f));
                x.push(map.charAt((b >> 6) & 0x3f));
                x.push(map.charAt(b & 0x3f));
            }

            switch (s.length - len) {
                case 1:
                    b = s.charCodeAt(i) << 16;
                    x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + padchar + padchar);
                    break;
                case 2:
                    b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8);
                    x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + map.charAt((b >> 6) & 0x3f) + padchar);
                    break;
            }
            return x.join('');
        }
    },
    purchaseDataSet: function (items, pdata, eCfg) {
        var ndata = [];
        var count = 0;
        var pnum = 0;
        for (var i = 0; i < items.length; i++) {
            var data = items[i];
            var gitem = {};
            var goods = data.goods;
            goods.oitid = data.id;
            goods.ucnname = goods.units[data.type].cnname;
            goods.ucreatetime = goods.units[data.type].createtime;
            goods.purchasePrice = iwfTool.toFixed(goods.units[data.type].purchasePrice, 2);
            goods.definedPrice = iwfTool.toFixed(data.definedPrice, 2);
            goods.num = data.num;
            var econf = iwfTool.getCfg(goods.purchasePrice, eCfg);
            goods.lowestPrice = iwfTool.toFixed(goods.units[data.type].lowestPurchasePrice, 2);//purchasePrice*econf.purchaseRate
            goods.hightestPrice = iwfTool.toFixed(goods.units[data.type].hightestPurchasePrice, 2);
            goods.econf = econf;


            if (data.isDefined == 1) {
                goods.purchasePrice = goods.definedPrice;
                goods.total = goods.definedPrice * goods.num;
            } else {
                goods.purchasePrice = iwfTool.toFixed(goods.units[data.type].purchasePrice, 2);
                goods.total = goods.purchasePrice * goods.num;
            }
            count += goods.total;
            pnum += data.num;
            ndata.push(goods);
        }
        pdata.total = iwfTool.toFixed(count, 2);
        pdata.num = pnum;
        ndata.push(pdata);
        return ndata;
    },
    LoadCrm: function (el, keyword, index, size) {
        if (!keyword) keyword = '';
        var ps = {
            keyword: keyword,
            isDeleted: 0,
            type: 0,
            fromdate: '',
            todate: '',
            index: index,
            size: size, userid: 13, comid: 4
        };
        var pageConfig = {
            total: 0,
            pageSize: 20,
            pageCount: 0,
            pageIndex: 1,
            pageclick: function (pageIndex, pageSize) {
                alert(0);
                iwfTool.LoadCrm(el, '', pageIndex, pageSize);
            }
        };

        $.getJSON('../ServiceFramework/crm/slist.data', ps, function (js, scope) {
            el.render(js.data);
            el.tool.PageBar(pageConfig, js);
        });
    },
    LoadEntity: function (el, keyword, index, size, url) {
        if (!keyword) keyword = '';
        var ps = {
            keyword: keyword,
            isDeleted: 0,
            type: 0,
            fromdate: '',
            todate: '',
            index: index,
            size: size,
        };
        var pageConfig = {
            total: 0,
            pageSize: 20,
            pageCount: 0,
            pageIndex: 1,
            pageclick: function (pageIndex, pageSize) {
                iwfTool.LoadEntity(el, '', pageIndex, pageSize);
            }
        };

        $.getJSON(url, {json: utils.fromJSON(ps)}, function (js, scope) {
            el.render(js.data);
            el.tool.PageBar(pageConfig, js);
        });
    },
    userCfg: function () {
        var cfg = {
            changeDate: function (d) {
                return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
            },
            columns: [
                {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
                , {title: '用户名称', text: '<a href="javascript:void(0)">{cnname}</a>', width: '120px'}
                , {title: '联系电话', text: '{tel}', width: '120px'}
                , {title: '联系电话2', text: '{tel2}', width: '120px'}
                , {title: 'QQ号码', text: '{QQ}', width: '80px'}
                , {title: '办公电话', text: '{office_tel}', width: '120px'}
                , {title: '地址', text: '{address}', width: '120px'}
            ],
            rowclick: function (sender) {
                // alert(sender.data);
            }
        };
        cfg.json = {
            TableName: "PLAT_USER",
            Fields: "user_id as 'id',cnname,autoid,office_tel,QQ,tel2,tel,address",
            Condition: []
        };
        cfg.url = '/ServiceFramework/form/list.data';
        return cfg;
    },
    crmCfg: function () {
        var cfg = {
            changeDate: function (d) {
                return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
            },
            columns: [
                {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
                , {title: '客户名称', text: '<a href="javascript:void(0)">{cnname}</a>', width: '120px'}
                , {title: '联系电话', text: '{tel}', width: '120px'}
                , {title: '联系电话2', text: '{tel2}', width: '120px'}
                , {title: 'QQ号码', text: '{qq}', width: '80px'}
                , {title: '办公电话', text: '{officeTel}', width: '120px'}
                , {title: '地址', text: '{address}', width: '120px'}
            ],
            rowclick: function (sender) {
                // alert(sender.data);
            }
        };
        cfg.json = {
            TableName: "CRM_CUSTOMER",
            Fields: "c_id as 'id',cnname,autoid,officeTel,qq,tel2,tel,address",
            Condition: []
        };
        cfg.url = '/ServiceFramework/form/list.data';
        return cfg;
    },
    supCfg: function () {
        var cfg = {
            changeDate: function (d) {
                return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
            },
            columns: [
                {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
                , {title: '供应商名称', text: '<a href="javascript:void(0)">{cnname}</a>', width: '120px'}
                , {title: '联系电话', text: '{tel}', width: '120px'}
                , {title: '联系电话2', text: '{tel2}', width: '120px'}
                , {title: 'QQ号码', text: '{qq}', width: '80px'}
                , {title: '办公电话', text: '{officeTel}', width: '120px'}
                , {title: '地址', text: '{address}', width: '120px'}
            ],
            rowclick: function (sender) {
                // alert(sender.data);
            }
        };
        cfg.json = {
            TableName: "CRM_AGENCY",
            Fields: "a_id as 'id',cnname,autoid,officeTel,qq,tel2,tel,address",
            Condition: []
        };
        cfg.url = '/ServiceFramework/form/list.data';
        return cfg;
    },
    LoadWinGrid: function (keyword, index, size, boxEl, cfg) {
        var tpl = '<div class="row" style="height:300px;overflow:hidden;"></div>';
        var temp = {};
        $('body').Dialog({
            title: '请选择相应的数据', tpl: tpl, width: 650, load: function (el) {
                iwfTool.LoadGridView(el, keyword, index, size, temp, cfg);
            }, click: function (e) {
                if (e.data.ok) {
                    var rows = temp.selectGrid.getSelected();
                    if (rows.length == 0) {
                        $.fn.alert({success: false, msg: '请先选择记录'});
                        return;
                    }
                    boxEl.opts.data = rows;
                    boxEl.find('input').val(rows[0].cnname);
                }
            }
        });
    },
    getWinGrid: function (keyword, index, size, cfg, callback) {
        var tpl = '<div class="row" style="height:300px;overflow:hidden;"></div>';
        var temp = {};
        $('body').Dialog({
            title: '请选择相应的数据', tpl: tpl, width: 650, load: function (el) {
                iwfTool.LoadGridView(el, keyword, index, size, temp, cfg);
            }, click: function (e) {
                if (e.data.ok) {
                    var rows = temp.selectGrid.getSelected();
                    if (rows.length == 0) {
                        $.fn.alert({success: false, msg: '请先选择记录'});
                        return;
                    }
                    callback(rows);
                }
            }
        });
    },
    LoadGridView: function (el, keyword, index, size, temp, cfg) {
        el.empty();
        var barEl = $('<div style="width:100%;"></div>').appendTo(el);
        var sEl = $('<div style="width:180px;float:left;margin-top:8px;"></div>').appendTo(barEl);
        sEl.SearchBox({
            click: function (e) {
                iwfTool.LoadGridView(el, e.text, index, size, temp, cfg);
            }
        });
        var gridEl = $('<div style="float:left;"></div>').appendTo(el);
        var ps = cfg.ps || {
                keyword: keyword || '',
                isDeleted: 0,
                type: 0,
                fromdate: '',
                todate: '',
                index: index,
                size: size
            };
        ps.json = utils.fromJSON(cfg.json);
        var pageConfig = {
            total: 0, pageSize: 20, pageCount: 0, pageIndex: 1, pageclick: function (pageIndex, pageSize) {
                iwfTool.LoadGridView(el, keyword, pageIndex, pageSize, temp, cfg);
            }
        };

        $.getJSON(cfg.url, ps, function (js, scope) {
            barEl.PageBar(pageConfig, js);
            cfg.data = js.data;
            temp.selectGrid = gridEl.iwfGrid(cfg);
        });
    },
    validator: function (formEl) {
        return formEl.bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                username: {
                    message: 'The username is not valid',
                    validators: {
                        notEmpty: {
                            message: '不允许为空'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: '长度必须为6-30位之间'
                        },
                        /*remote: {
                         url: 'remote.php',
                         message: 'The username is not available'
                         },*/
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: '必须是英文、点、数字'
                        }
                    }
                },
                price: {
                    message: 'The username is not valid',
                    validators: {
                        notEmpty: {
                            message: '不允许为空'
                        },
                        stringLength: {
                            min: 1,
                            max: 10,
                            message: '长度必须为1-10位之间'
                        },
                        regexp: {
                            regexp: /^[0-9_\.]+$/,
                            message: '必须是点、数字'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: '电子邮件不允许为空'
                        },
                        emailAddress: {
                            message: '必须是电子邮箱格式'
                        }
                    }
                },
                password: {
                    validators: {
                        stringLength: {
                            min: 6,
                            max: 18,
                            message: '长度必须为6-18位之间'
                        },
                        notEmpty: {
                            message: '密码项不允许为空'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: '必须是英文、点、数字'
                        }
                    }
                },
                textbox: {
                    validators: {
                        notEmpty: {
                            message: '不允许为空'
                        }
                    }
                },
                phone: {
                    message: '手机号码无效',
                    validators: {
                        notEmpty: {
                            message: '手机号码不允许为空'
                        },
                        stringLength: {
                            min: 11,
                            max: 11,

                            message: '长度必须为11位之间'
                        },
                        regexp: {
                            // regexp:/^1[3|4|5|8][0-9]\d{9}$/,
                            regexp: /(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[6,7,8]\d{8}$|(^18\d{9}$)/g,
                            message: '必须是11位数字'
                        },
                        digits: {
                            message: '手机号码只能是数字'
                        }
                    }
                },
                total: {
                    message: '数量无效',
                    validators: {
                        notEmpty: {
                            message: '不允许为空'
                        },
                        stringLength: {
                            min: 1,
                            max: 11,
                            message: '长度必须为11位之间'
                        },
                        digits: {
                            message: '只能是数字'
                        }
                    }
                },
                yearMonthDay: {
                    validators: {
                        notEmpty: {
                            message: '不允许为空、格式为YYYY-MM-DD'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            separator: '-'
                        }
                    }
                },
                yearMontDayhTime: {
                    validators: {
                        notEmpty: {
                            message: '不允许为空、格式为yyyy-mm-dd hh:ii:ss'
                        },
                        date: {
                            format: 'YYYY-MM-DD HH:MM:SS',
                            separator: '-'
                        }
                    }
                },
                checkbox: {
                    validators: {
                        notEmpty: {
                            message: '必须选一个'
                        }
                    }
                },
                radiobox: {
                    validators: {
                        notEmpty: {
                            message: '必须选一个'
                        }
                    }
                }
            }
        });
    }
}

function WinPrjGridCfg() {
    var cfg = {
        changeDate: function (d) {
            return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
        },
        columns: [
            {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
            , {title: '项目名称', text: '<a href="javascript:void(0)">{cnname}</a>', width: '120px'}
            , {title: '新建日期', text: '{changeDate(createtime)}', width: '120px'}
            , {title: '预计完成日期', text: '{changeDate(finishdate)}', width: '120px'}
            , {title: '乙方名称', text: '{partyb_name}', width: '80px'}
            , {title: '项目金款', text: '{amount}', width: '120px'}
            , {title: '预产金款', text: '{pre_amount}', width: '120px'}
        ],
        rowclick: function (sender) {
            // alert(sender.data);
        }
    };
    cfg.json = {
        TableName: "CRM_PROJECT",
        Fields: "prj_id as 'id',cnname,autoid,createtime,partyb_name,amount,pre_amount,finishdate",
        Condition: []
    };
    cfg.url = '/ServiceFramework/form/list.data';
    return cfg;
}
function WinUserGridCfg() {
    var cfg = {
        changeDate: function (d) {
            return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
        },
        columns: [
            {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
            , {title: '用户名称', text: '<a href="javascript:void(0)">{cnname}</a>', width: '120px'}
            , {title: '用户帐号', text: '{username}', width: '120px'}
            , {title: '联系电话', text: '{tel}', width: '120px'}
            , {title: '新建日期', text: '{changeDate(createtime)}', width: '120px'}
            , {title: '电子邮箱', text: '{email}', width: '80px'}
            , {title: '地址', text: '{address}', width: '120px'}
        ],
        rowclick: function (sender) {
            // alert(sender.data);
        }
    };
    cfg.json = {
        TableName: "PLAT_USER",
        Fields: "user_id as 'id',fullname as 'cnname',autoid,createtime,email,username,tel,address",
        Condition: []
    };
    cfg.url = '/ServiceFramework/form/list.data';
    return cfg;
}
function WinStoreGridCfg() {
    var cfg = {
        changeDate: function (d) {
            return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
        },
        columns: [
            {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
            , {title: '仓库名称', text: '<a href="javascript:void(0)">{cnname}</a>', width: '120px'}
            , {title: '联系电话', text: '{tel}', width: '120px'}
            , {title: '新建日期', text: '{changeDate(createtime)}', width: '120px'}
            , {title: '仓库容量', text: '{totalv}', width: '80px'}
            , {title: '使用率', text: '{rate}', width: '120px'}
            , {title: '锁匙地址', text: '{keyAddress}', width: '120px'}
        ],
        rowclick: function (sender) {
            // alert(sender.data);
        }
    };
    cfg.json = {
        TableName: "E_STORE",
        Fields: "s_id as 'id',cnname,autoid,createtime,totalv,rate,tel,keyAddress",
        Condition: []
    };
    cfg.url = '/ServiceFramework/form/list.data';
    return cfg;
}
function WinDeptGridCfg() {
    var cfg = {
        changeDate: function (d) {
            return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
        },
        columns: [
            {title: '<input type="checkbox" />', text: '<input type="checkbox" />', width: '30px', click: true}
            , {title: '部门名称', text: '<a href="javascript:void(0)">{cnname}</a>', width: '120px'}
            , {title: '联系电话', text: '{tel}', width: '120px'}
            , {title: '新建日期', text: '{changeDate(createtime)}', width: '120px'}
            , {title: '负责人名称', text: '{manager}', width: '80px'}
            , {title: '描述', text: '{remark}', width: '120px'}
        ],
        rowclick: function (sender) {
            // alert(sender.data);
        }
    };
    cfg.json = {
        TableName: "PLAT_DEPT",
        Fields: "dept_id as 'id',cnname,autoid,createtime,manager,tel,description",
        Condition: []
    };
    cfg.url = '/ServiceFramework/form/list.data';
    return cfg;
}
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
IWF.alert = function (json) {
    $.fn.alert({success: false, msg: json.msg});
}
IWF.alert2 = function (json) {
    if (json.succ) json.type = 'success';
    else json.type = 'warning';
    var tpl = '<div class="alert alert-{type}" style="position: fixed;width:100%;top:0px;z-index:999;">{msg}</div>';
    var me = $(utils.replaceTpl(tpl, json)).appendTo($('body'));
    var myVar = setTimeout(function () {
        myTimer()
    }, 4000);

    function myTimer() {
        myStopFunction();
    }

    function myStopFunction() {
        me.hide(4000);
        me.remove();
        clearInterval(myVar);
    }
}