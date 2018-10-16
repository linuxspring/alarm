var FrameWork = IWF.FrameWork = function (doc, options) {
    var me = this;
    me.options = utils.extend({
        title: IWF.name,
        title: IWF.name,
        userInfo: {},
        navTree: [],
    }, options);
    //全局用户变量，此变量每次登录都改变
    me.sid = me.options.sid;
    me.rootPath = me.options.rootPath;
    //命令
    me.commands = {};
    //导航
    me.navigators = [];
    //权限
    me.rules = {};
    //首页portal
    me.portals = {};

    me.renderToDom(doc);
    me.loadPlugins();
    //初始化事件
    me.fireEvent('init');
    me.initEvent();
    /*渲染，与ready可能存在异步调用*/
    me.fireEvent('render');
    /*初始化完成*/
    me.fireEvent('ready');
    /*刷新机制*/
    me.fireEvent('hashchange');
};

FrameWork.prototype = {
    //文件上传消息
    uploadResponse: function (json, key) {
        var me = this;
        if (key) json.key = key;
        //触发上传事件
        me.fireEvent('upload', json);
    },

    width: function () {
        if (this.document) return this.document.documentElement.clientWidth;
        else return 0;
    },
    height: function () {
        if (this.document) return this.document.documentElement.clientHeight;
        else return 0;
    },

    renderToDom: function (doc) {

        var me = this;
        me.document = doc;
        me.window = doc.defaultView || window;
        me.body = doc.body;
        me.document.title = me.options.title;

        function onMainResize() {

            me.main.style.cssText = 'height:' + (me.document.documentElement.clientHeight - me.top.clientHeight) + 'px;';
        };

        /*调用一次*/
        // onMainResize();
        //me.addListener('resize', onMainResize);
    },

    initEvent: function () {
        var me = this;
        /*事件委托*/
        me.eventProxy = utils.bind(me.eventProxy, me);
        /*注册手势事件*/
        //utils.on(me.body, ['touchstart', 'touchend', 'touchmove', 'mouseup', 'mousedown', 'mouseup'], me.eventProxy);
        utils.on(me.window, ['hashchange'], me.eventProxy);
    },

    /* 为编辑器设置默认参数值。*/
    setOpt: function (config) {
        utils.extend(this.options, config, true);
    },

    /*加载插件*/
    loadPlugins: function () {
        var me = this;
        for (var pi in IWF.plugins) {
            IWF.plugins[pi].call(me);
        }
        ;
    },

    /*执行命令*/
    execCommand: function (cmdName) {
        var key = cmdName.toLowerCase();
        var me = this, result, cmd = me.commands[key];

        if (!cmd || !cmd.execCommand) {
            return null;
        }
        me.fireEvent('beforeexeccommand', key);
        arguments[0] = key;
        result = cmd.execCommand.apply(this, arguments);
        me.fireEvent('afterexeccommand', key);
        return result;
    },

    /*查询命令返回值*/
    queryCommandValue: function (cmdName) {
        var key = cmdName.toLowerCase();
        var me = this, cmd = me.commands[key];

        if (cmd && cmd.queryCommandValue) {
            arguments[0] = key;
            return cmd.queryCommandValue.apply(this, arguments);
        }
        else return null;
    },

    /*事件委托*/
    eventProxy: function (e) {
        this.fireEvent(e.type.replace(/^on/, ''), e);
    }
};
utils.extend(FrameWork.prototype, EventBase);
