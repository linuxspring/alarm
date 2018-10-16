IWF.plugins['hashmanage'] = function () {


    var me = this,
        /*缓存最近一次路径*/
        hash = {},
        history = [],
        urlReg = [/#([a-z0-9_-]+)\.([a-z0-9_-]+)\:(\{[^\{]*\})$/i, /#([a-z0-9_-]+)\.([a-z0-9_-]+)$/i, /#([a-z0-9_-]+)$/i];


    /*改变地址路径*/
    me.commands['go'] = {
        execCommand: function (key, args) {
            if (!args) return;
            var shs = hash[args.a];
            var hs = args.a + "." + ((args.b) ? args.b : (shs && shs.b) ? shs.b : 'empty');
            if (args.params) hs += ':' + utils.fromJSON(args.params);
            else if (shs && (shs.b == args.a) && shs.params) hs += ':' + utils.fromJSON(shs.params);
            /*改变hash*/
            me.window.location.href = me.window.location.pathname + me.window.location.search + "#" + escape(hs);
        }
    };

    //回退
    me.commands['redo'] = {
        execCommand: function (key, args) {
            alert('redo');
        }
    };

    //
    me.commands['remove'] = {
        execCommand: function (key, args) {
            alert('redo');
        }
    };

    /*关闭缓存路径*/
    me.commands['close'] = {
        execCommand: function (key, args) {
            if (!args) return;
            var key = utils.isString(args) ? args : args.a;

            /*移除与关闭模块有关的历史记录*/
            for (var i = history.length - 1; i >= 0; i--) {
                if (history[i].key == key) {
                    history.splice(i, 1);
                }
            }
            /*触发关闭事件*/
            //me.fireEvent('close', args);
            /*调用历史回退*/
            if (history.length > 0 && hash.hasOwnProperty(key)) {
                me.window.location.href = me.window.location.pathname + me.window.location.search + "#" + escape(history.pop().value);
            } else {

                //me.window.location.href = me.window.location.pathname + me.window.location.search;
            }
        }
    };

    /*URL hash事件*/
    me.addListener('hashchange', function (args) {

        var hashStr = unescape(location.hash);

        if (urlReg[0].test(hashStr) || urlReg[1].test(hashStr) || urlReg[2].test(hashStr)) {
            var moduleKey = RegExp.$1;
            if (!hash[moduleKey]) hash[moduleKey] = {a: moduleKey};
            if (RegExp.$2) hash[moduleKey].b = RegExp.$2;
            if (RegExp.$3) hash[moduleKey].params = utils.toJSON(RegExp.$3);

            /*保存历史记录*/
            if (RegExp.$1) {
                history.push({key: moduleKey, value: hashStr.replace(/^#/i, '')});
                if (history.length > 20) history.splice(0, 1);
            }

            me.currentModule = hash[moduleKey];
            /*激活*/
            me.fireEvent('do', me.currentModule);
        } else {
            /*如果没有模块被激活则初始化*/
            me.fireEvent('initurl', {});
        }
    });
};