IWF = window.IWF = {};
IWF.plugins = {};
IWF.ui = {};
IWF.version = "1.0.0.1";
IWF.shortName = "监控";
IWF.extName = "业务审批系统";
IWF.name = "企业监控服务管理平台";
IWF.company = "广州中软信息技术有限公司";
IWF.sid = null;

(function () {
    var reg = new RegExp("(^|&)sid=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        IWF.sid = unescape(r[2]);
        //document.write('<script type="text/javascript" src="login.data?action=getalljs&sid=' + IWF.sid + '"></script>');
    }

    var paths = [
        'core/utils.js',
        'core/eventbase.js',
        'core/framework.js',
        'core/component.js',
        'core/ui3.js',
        'ref/security/tripledes.js',
        'ref/security/mode-ecb-min.js',
        'ref/validate/validate.js',
        'plugins/corepackage/actions.js',
        'plugins/corepackage/navigate.js',
        'plugins/corepackage/banner.js',
        'plugins/corepackage/hashmanage.js',
        'plugins/corepackage/content.js',
        'plugins/corepackage/eventframe.js',
        'plugins/corepackage/filemanage.js',
        'plugins/corepackage/rules.js',
        //'plugins/corepackage/index.js',
        'plugins/mgrpackage/systemmgr.js',
        'plugins/mgrpackage/usermgr.js',
        'plugins/mgrpackage/rolemgr.js',
        'plugins/mgrpackage/rulemgr.js',
        'plugins/mgrpackage/menumgr.js',
        'plugins/mgrpackage/deptmgr.js',
        'plugins/mgrpackage/deptuser.js',
        'plugins/mgrpackage/profile.js',
        'plugins/mgrpackage/userinfo.js',
        'plugins/oapackage/taskmgr.js',
        'plugins/oapackage/weekbookmgr.js',
        'plugins/oapackage/projectmgr.js',
        'plugins/oapackage/todotask.js',
        'plugins/oapackage/histask.js',
        'plugins/oapackage/allhistask.js',
        'plugins/mgrpackage/dictmgr.js',
        'plugins/oapackage/fenpaitask.js',
        'plugins/oapackage/taskdetail.js',
        'plugins/mgrpackage/logmgr.js',
        'plugins/oapackage/importtask.js',
        'plugins/oapackage/apprtask.js',
        'plugins/oapackage/unfinishedtask.js'

    ];

    for (var i = 0, pi; pi = paths[i++];) {
        document.write('<script type="text/javascript" src="' + pi + '"></script>');
    }
})();
