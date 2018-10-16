IWF.plugins['banner'] = function () {

    var me = this;

    function changeDate(d) {
        return d.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+).+$/, '$1年$2月$3日');
    }

    me.addListener('render', function () {

    });

    this.addListener('ready', function () {
        me.fireEvent('timer');
    });
};