IWF.plugins['rules'] = function () {

    var me = this;


    function RuleArray(arr, field) {
        var bArr = [];
        //var arr=me.options.userInfo.uRule;
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i][field];
            var _arr = temp.split(',');
            bArr = utils.mergeArray(bArr, _arr);
        }
        return bArr;
    }

    function isExits(arr, o) {
        for (var i = 0; i < arr.length; i++) {
            if (o == arr[i]) {
                return true;
            }
        }
        return false;
    }

    var rule = RuleArray(me.options.userInfo.uRule, 'fun');// utils.toJSON(me.options.userInfo.uRule.forn);

    me.commands['rules'] = {
        execCommand: function (key, arg) {
            return isExits(rule, arg.key);
        }
    };
};