IWF.plugins['messagebox'] = function () {

    var me = this;

    var boxBgTpl = '<div class="iwf-window-bg"></div>',
        rootTpl = '<div class="iwf-window" style="min-width:300px;"></div>',
        titleTpl = '<div style="height:20px;padding:5px;"  class="iwf-window-title">{title}</div>',
        contentTpl = '<div style="min-height:30px;padding:10px;line-height:30px;" class="iwf-window-content"></div>',
        footTpl = '<div style="min-height:28px;padding-top:2px;text-align: center;background:#f5f5f5;" ></div>',
        itemTpl = '<div><label style="width:60px;display:inline-block;text-align:right;">{text}</label> </div>',
        textTpl = '<div>{text}</div>';

    function setPosition(win) {
        win.css({left: (me.width() - win.width()) / 2, top: (me.height() - win.height()) / 2});
    };

    me.commands['waiting'] = {
        execCommand: function (key, json, callback) {
            var box = $(boxBgTpl).appendTo(me.body);
            var root = box.win = $(rootTpl).appendTo(box);
            box.title = $(utils.replaceTpl(titleTpl, {title: '等待'})).appendTo(root);
            var content = box.content = $(contentTpl).appendTo(root);
            box.content.css({padding: '20px'});
            box.content.append('<img src="resources/loading.gif" align="middle" style="margin:10px;" />');
            box.content.append((json) ? json.text : '加载中，请稍候。');
            setPosition(root);
            box.close = function () {
                box.remove();
            }
            return box;
        }
    };

    me.commands['prompt'] = {
        execCommand: function (key, json, callback) {
            var box = $(boxBgTpl).appendTo(me.body);
            var root = box.win = $(rootTpl).appendTo(box);
            box.title = $(utils.replaceTpl(titleTpl, {title: '系统输入'})).appendTo(root);
            var content = box.content = $(contentTpl).appendTo(root);

            for (var i = 0, item; item = json[i++];) {
                if (utils.isString(item)) $(utils.replaceTpl(textTpl, {text: item})).appendTo(content);
                else {
                    var ui = $(utils.replaceTpl(itemTpl, item)).appendTo(content);
                    if (item.options) {
                        item.ui = $('<select style="width:200px;"></select>').appendTo(ui);
                        for (var j = 0, ji; ji = item.options[j++];) {
                            item.ui.append(utils.replaceTpl('<option value="{value}">{text}</option>', ji));
                        }
                    } else if (item.label) {
                        ui.append(item.label);
                    } else {
                        item.ui = $('<input style="width:200px;"/>').appendTo(ui);
                    }
                    if (item.value) item.ui.val(item.value);
                }
            }

            box.foot = $(footTpl).appendTo(root);
            setPosition(root);
            var buttons = [{
                text: '[ 确定 ]',
                click: function () {
                    for (var i = 0, item; item = json[i++];) {
                        if (item.ui) item.value = item.ui.val();
                    }
                    if (callback) callback(json);
                    box.remove();
                }
            }, {
                text: '[ 取消 ]',
                click: function () {
                    box.remove();
                }
            }
            ];
            box.foot.iwfToolBar({data: buttons});
            return box;
        }
    };

    me.commands['alert'] = {
        execCommand: function (key, text, callback) {

            var data = {title: '系统提示', text: text};

            var box = $(boxBgTpl).appendTo(me.body);
            var root = box.win = $(rootTpl).appendTo(box);
            box.title = $(utils.replaceTpl(titleTpl, data)).appendTo(root);
            box.content = $(contentTpl).appendTo(root);
            box.content.css({padding: '20px'});
            box.content.append(data.text);
            box.foot = $(footTpl).appendTo(root);
            setPosition(root);
            var buttons = [{
                text: '[ 确定 ]',
                click: function () {
                    if (callback) callback();
                    box.remove();
                }
            }];
            box.foot.iwfToolBar({data: buttons});
            return box;
        }
    };

    me.commands['confirm'] = {
        execCommand: function (key, text, callback) {

            var data = {title: '系统提示', text: text};

            var box = $(boxBgTpl).appendTo(me.body);
            var root = box.win = $(rootTpl).appendTo(box);
            box.title = $(utils.replaceTpl(titleTpl, data)).appendTo(root);
            box.content = $(contentTpl).appendTo(root);
            box.content.css({padding: '20px'});
            box.content.append(data.text);
            box.foot = $(footTpl).appendTo(root);
            setPosition(root);
            var buttons = [{
                text: '[ 确定 ]',
                click: function () {
                    if (callback) callback();
                    box.remove();
                }
            }, {
                text: '[ 取消 ]',
                click: function () {
                    box.remove();
                }
            }
            ];
            box.foot.iwfToolBar({data: buttons});
            return box;
        }
    };
};