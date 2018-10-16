IWF.plugins['navigate'] = function () {
    var me = this,
        nav = $('#maintab'),
        navTpl = '<div class="main-nav" data-toggle="tooltip" data-placement="right" title="{title}">'
            + '<div class="main-nav-in"><i class="{icon} icon-large {color}"></i></div></div>';
    var ulTpl = '<div class="navbar-collapse collapse menu-nav" role="navigation">'
        + '<div class="navbar-collapse collapse" style="background-color: white;border-radius: 4px;">'
        + '<ul class="nav navbar-nav">'
        + '<li>'
        + '<ul class="nav navbar-nav"><li><ul id="itemMenu" class="nav navbar-nav">'
        //+'<li class="active"><a href="javascript:void(0);" title="{title}">{title}</a></li>'
        + '</ul></li>'
        + '<li  class="dropdown">'
        + '<a href="#" class="dropdown-toggle" data-toggle="dropdown">其它<span class="caret"></span></a>'
        + '<ul  class="dropdown-menu" role="menu">'
        + '<li class="selected"><a href="javascript:void(0);" title="{title}">{title}</a></li>'
        + '</ul>'
        + '</li>'
        + '</ul>'
        + '</li>'
        + '</ul>'
        + '</div>'
        + '</div>';
    var liTpl = '<li class="active"><a href="javascript:void(0);" title="{title}">{title}</a></li>';

    var navData = [];

    function itemClick(sender) {
        if (sender.data.a) me.execCommand('go', sender.data);
    }

    function fresh2() {
        var tdata = utils.sort(navData);
        var ul = $(navTpl).appendTo(nav);//var ul=$(ulTpl).appendTo(nav);
        utils.each(tdata, function (index, item) {
            var ui = $(utils.replaceTpl(liTpl, item)).appendTo(ul.find('#itemMenu'));//ul.find('#itemMenu')
            ui.bind('click', item, itemClick);
        });
    }

    function fresh() {
        var tdata = utils.sort(navData);
        utils.each(tdata, function (index, item) {
            //var ui = $(utils.replaceTpl(navTpl, item)).appendTo(nav);
            //ui.bind('click', item, itemClick);
        });
    }

    /*添加导航*/
    me.commands['addnav'] = {
        execCommand: function (key, args) {
            if (!args.icon) args.icon = 'icon-envelope-alt';
            navData.push(args);
        }
    };

    me.addListener('render', fresh);
};