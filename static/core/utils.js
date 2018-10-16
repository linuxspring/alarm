var utils = IWF.utils = {

    mergeArray: function (arr1, arr2) {
        var _arr = [];
        for (var i = 0; i < arr1.length; i++) {
            _arr.push(arr1[i]);
        }
        var _dup;
        for (var i = 0; i < arr2.length; i++) {
            _dup = false;
            for (var _i = 0; _i < arr1.length; _i++) {
                if (arr2[i] === arr1[_i]) {
                    _dup = true;
                    break;
                }
            }
            if (!_dup) {
                _arr.push(arr2[i]);
            }
        }

        return _arr;
    },

    /*数组排序*/
    sort: function (arr, key) {
        var tkey = (key) ? key : 'index';
        return arr.sort(function (x, y) {
            return x[tkey] - y[tkey];
        });
    },

    ///*取得16*16图标*/
    //getIcon16: function (x, y) {
    //    if (y == undefined) {
    //        var ss = x.split(',');
    //        x = parseInt(ss[0]);
    //        y = parseInt(ss[1]);
    //    }
    //    if (x > 0 && y > 0)
    //        return 'background-image:url(resources/iwf-icon-16x16.png);height: 16px;width: 16px;display:block;background-position: -' + (y - 1) * 16 + 'px -' + (x - 1) * 16 + 'px;';
    //    else
    //        return 'height: 16px;width: 16px;display:block;';
    //},

    ///*取得48*48图标*/
    //getIcon48: function (x, y) {
    //    if (y == undefined) {
    //        var ss = x.split(',');
    //        x = parseInt(ss[0]);
    //        y = parseInt(ss[1]);
    //    }
    //    if (x > 0 && y > 0)
    //        return 'background-image:url(resources/iwf-icon-48x48.png);height: 52px;width: 52px;display:block;background-position: -' + (y - 1) * 67 + 'px -' + (x - 1) * 55 + 'px;';
    //    else
    //        return 'height: 52px;width: 52px;display:block;';
    //},

    tplReg1: /\{(\w+):(\{[^\{\}]+\})\}/g,       //{key:{a:b}}
    tplReg2: /\{([^\{\}]+)\}/g,                 //{key}
    tplReg3: /\{(\w+)\(([^\(\)]+)\)\}/g,        //{fn(key)}
    /*替换TPL中的变量{key} OR {key:{a:b}} OR {fn(key)}*/
    replaceTpl: function (tpl, data, fns) {
        return tpl.replace(utils.tplReg1, function (sender, key, value) {
            return value.replace(utils.tplReg2, function (sender, key2) {
                var fields = key2.split(":");
                var v = data[key][fields[0]];
                if (fields.length == 2) {
                    v = data[key][fields[0]][fields[1]];
                }
                if (utils.isString(v)) {
                    return v || ''
                } else {
                    return v;
                }
            }).replace(utils.tplReg3, function (sender, key2, value2) {
                var v = (value2 == 'this') ? data[key] : data[key][value2];
                return (fns[key2]) ? fns[key2](v) : v;
            });
            //var json = utils.toJSON(value);
            //var jsonkey = data[key] || key;
            //return json[jsonkey] || jsonkey;
        }).replace(utils.tplReg3, function (sender, key, value) {
            var v = (value == 'this') ? data : data[value];
            return (fns[key]) ? fns[key](v) : v;
        }).replace(utils.tplReg2, function (sender, key) {
            if (utils.isString(data[key])) {
                return data[key] || ''
            } else {
                return data[key];
            }

        });
    },

    /*取得一个随机号,以后可能用guid取代*/
    guid: function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },

    /*增加一个随机ID*/
    params: function (arg) {
        if (arg) arg._rendomid = utils.guid();
        return arg;
    },

    /*取得当前时间*/
    now: function (format) {
        return utils.formatDate(new Date(), format);
    },

    /*格式化时间*/
    formatDate: function (date, format) {
        if (!format) format = 'yyyy-MM-dd hh:mm:ss';
        var year = date.getFullYear(), moth = date.getMonth() + 1, day = date.getDate(),
            hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();

        if (moth < 10) moth = "0" + moth;
        if (day < 10) day = "0" + day;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;

        return format.replace('yyyy', year).replace('MM', moth).replace('dd', day).replace('hh', hours).replace('mm', minutes).replace('ss', seconds);
    },

    /*将dom转换为有格式的HMTL字符串*/
    getDomHtml: function (root) {

        var htmlText = '',
            indentChar = '  ',
            breakChar = '\n',
            uncontrol = {input: 1, text: 1, br: 1},
            unbreak = {strong: 1, em: 1, span: 1, u: 1, text: 1, a: 1, b: 1},
            reg = /^<[^<>]+>/i;

        function startHtml(tchar, name, text) {
            if (unbreak[name]) {
                htmlText += text;
            }
            else {
                htmlText += breakChar + tchar + text;
            }
        }

        function endHtml(tchar, name, hasChild) {
            if (uncontrol[name]) return;
            if (hasChild && !unbreak[name]) htmlText += breakChar + tchar;
            htmlText += '</' + name + '>';
        }

        function domToHtml(dom, level) {
            var name = dom.nodeName.toLowerCase().replace('#', ''),
                ntext = (dom.outerHTML) ? dom.outerHTML.match(reg) : utils.trim(dom.nodeValue),
                tchar = '';
            for (var ti = 0; ti < level; ti++) tchar += indentChar;
            if (ntext) {
                startHtml(tchar, name, ntext);
                var hasChild = false;
                if (dom.childNodes.length > 0) {
                    utils.each(dom.childNodes, function (index, cdom) {
                        if (domToHtml(cdom, level + 1)) hasChild = true;
                    });
                }
                endHtml(tchar, name, hasChild);
                return true;
            } else {
                return false;
            }
        }

        /*去除root*/
        utils.each(root.childNodes, function (index, cdom) {
            domToHtml(cdom, 0);
        });

        return htmlText;
    },

    /*字符串转换成json*/
    toJSON: function (str) {
        return (str) ? eval("(" + str.replace(/\n/g, '') + ")") : {};
    },

    /*json转换成字符串*/
    fromJSON: function (object) {
        var type = typeof object;
        if (object == null) {
            type = 'undefined';
        } else if ('object' == type) {
            if (Array == object.constructor)
                type = 'array';
            else if (RegExp == object.constructor)
                type = 'regexp';
            else
                type = 'object';
        }
        switch (type) {
            case 'undefined':
            case 'unknown':
                return;
                break;
            case 'function':
            case 'boolean':
            case 'regexp':
                return object.toString();
                break;
            case 'number':
                return isFinite(object) ? object.toString() : 'null';
                break;
            case 'string':
                return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g,
                        function () {
                            var a = arguments[0];
                            return (a == '\n') ? '\\n' :
                                (a == '\r') ? '\\r' :
                                    (a == '\t') ? '\\t' : ""
                        }) + '"';
                break;
            case 'object':
                if (object === null) return 'null';
                var results = [];
                for (var property in object) {
                    var value = utils.fromJSON(object[property]);
                    if (value !== undefined)
                        results.push(utils.fromJSON(property) + ':' + value);
                }
                return '{' + results.join(',') + '}';
                break;
            case 'array':
                var results = [];
                for (var i = 0; i < object.length; i++) {
                    var value = utils.fromJSON(object[i]);
                    if (value !== undefined) results.push(value);
                }
                return '[' + results.join(',') + ']';
                break;
        }
    },

    /*取得URL中的值*/
    getUrlValue: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },

    /*动态添加样式表*/
    addSheetFile: function (path) {
        var fileref = document.createElement("link")
        fileref.rel = "stylesheet";
        fileref.type = "text/css";
        fileref.href = path;
        fileref.media = "screen";
        var headobj = document.getElementsByTagName('head')[0];
        headobj.appendChild(fileref);
    },

    /**/
    each: function (obj, fn) {
        if (obj == null) return;
        $.each(obj, fn);
    },

    makeInstance: function (obj) {
        var noop = new Function();
        noop.prototype = obj;
        obj = new noop;
        noop.prototype = null;
        return obj;
    },
    /**
     * 将source对象中的属性扩展到target对象上
     */
    extend: function (t, s, b) {
        if (s) {
            for (var k in s) {
                if (!b || !t.hasOwnProperty(k)) {
                    t[k] = s[k];
                }
            }
        }
        return t;
    },
    /**
     * 模拟继承机制，subClass继承superClass
     */
    inherits: function (subClass, superClass) {
        var oldP = subClass.prototype,
            newP = utils.makeInstance(superClass.prototype);
        utils.extend(newP, oldP, true);
        subClass.prototype = newP;
        return (newP.constructor = subClass);
    },

    /*
     *指定上下文
     */
    bind: function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    },

    /**
     * 查找元素item在数组array中的索引, 若找不到返回-1
     */
    indexOf: function (array, item, start) {
        var index = -1;
        start = this.isNumber(start) ? start : 0;
        this.each(array, function (i, v) {
            if (i >= start && v === item) {
                index = i;
                return false;
            }
        });
        return index;
    },

    /**
     * 移除数组array中的元素item
     */
    removeItem: function (array, item) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                i--;
            }
        }
    },

    /**
     * 删除字符串str的首尾空格
     */
    trim: function (str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    },

    /*清除字符串中的空格及回车换行等*/
    trim2: function (str) {
        return (str) ? str.replace(/[ \t\n\r]/g, '') : str;
    },

    /*去掉换行符及其后面的空格*/
    trim3: function (str) {
        return (str) ? str.replace(/[\t\n\r] */g, '') : str;
    },

    /**
     * 将str中的html符号转义,默认将转义''&<">''四个字符，可自定义reg来确定需要转义的字符
     */
    unhtml: function (str, reg) {
        return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp);)?/g, function (a, b) {
                if (b) {
                    return a;
                } else {
                    return {
                        '<': '&lt;',
                        '&': '&amp;',
                        '"': '&quot;',
                        '>': '&gt;',
                        "'": '&#39;'
                    }[a]
                }

            }) : '';
    },
    /**
     * 将str中的转义字符还原成html字符
     */
    html: function (str) {
        return str ? str.replace(/&((g|l|quo)t|amp|#39);/g, function (m) {
                return {
                    '&lt;': '<',
                    '&amp;': '&',
                    '&quot;': '"',
                    '&gt;': '>',
                    '&#39;': "'"
                }[m]
            }) : '';
    },

    /**
     * 判断obj对象是否为空
     */
    isEmptyObject: function (obj) {
        if (obj == null) return true;
        if (this.isArray(obj) || this.isString(obj)) return obj.length === 0;
        for (var key in obj) if (obj.hasOwnProperty(key)) return false;
        return true;
    },

    /**
     * 深度克隆对象，从source到target
     */
    clone: function (source, target) {
        var tmp;
        target = target || {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                tmp = source[i];
                if (typeof tmp == 'object') {
                    target[i] = utils.isArray(tmp) ? [] : {};
                    utils.clone(source[i], target[i])
                } else {
                    target[i] = tmp;
                }
            }
        }
        return target;
    },

    /*
     *注册事件
     */
    on: function (el, type, handler) {
        if (!el) return;
        var types = utils.isArray(type) ? type : [type];
        utils.each(types, function (index, key) {
            if (el.addEventListener) {
                el.addEventListener(key, handler, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + key, handler);
            }
        });
    }
}

/**
 * 判断str是否为字符串
 */
/**
 * 判断array是否为数组
 */
/**
 * 判断obj对象是否为方法
 */
/**
 * 判断obj对象是否为数字
 */
utils.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Boolean'], function (index, v) {
    IWF.utils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    }
});