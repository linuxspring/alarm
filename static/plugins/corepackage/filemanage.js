IWF.plugins['filemanage'] = function () {

    var me = this,
        tpl = '<div class="picselector-item"><img src="{url}" /><br/>{name}</div>',
        tplForder = '<div class="picselector-item"><img src="resources/folder.png" /><br/>{name}</div>',
        selCss = 'picselector-item-sel';

    me.commands['filemanage'] = {
        execCommand: function (key, params) {

            function upClick() {
                if (folders.length > 0) {
                    folders.splice(folders.length - 1, 1);
                    folderClick();
                }
            }

            function uploadClick(form) {
                if (params.upload) params.upload(form, folders.join('\\'));
            }

            function addFolder() {
                if (params.addFolder) {
                    var d = [{text: "文件夹名", value: 'newfolder'}];
                    me.execCommand('prompt', d, function () {
                        if (d[0].value)
                            params.addFolder(folders.join('\\'), d[0].value);
                    });
                }
            }

            var config = {
                title: '文件管理',
                buttons: [
                    {text: '上传', type: 'upload', upload: uploadClick},
                    {text: '添加目录', click: addFolder},
                    '-',
                    {text: '上一级目录', click: upClick},
                    {
                        text: '关闭', click: function () {
                        win.close();
                    }
                    }
                ]
            };

            var win = $('body').iwfWindow(config);
            var folders = [];

            function itemClick(sender) {
                var ti = $(this);
                ti.addClass(selCss);
                ti.siblings().removeClass(selCss);
                if (params.itemClick) params.itemClick(sender.data.data);
            }

            function folderClick(sender) {
                if (sender && sender.data.data.name) folders.push(sender.data.data.name);
                var path = folders.join('\\');
                if (params.loadData) params.loadData(path, function (data) {
                    loadData(data || []);
                });
            }

            var loadData = function (data) {
                var c = win.content();
                c.children().remove();
                for (var i = 0, item; item = data[i++];) {
                    if (item.url) {
                        var temp = $(utils.replaceTpl(tpl, item)).appendTo(c);
                        temp.bind('click', {data: item}, itemClick);
                    } else {
                        var temp = $(utils.replaceTpl(tplForder, item)).appendTo(c);
                        temp.bind('click', {data: item}, folderClick);
                    }
                }
            }

            win.reload = folderClick;
            if (params.loadData) folderClick();
            return win;
        }
    }
}