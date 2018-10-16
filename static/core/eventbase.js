EventBase = {
    allListeners: {},
    /*添加监听*/
    addListener: function (types, listener) {
        types = utils.trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            if (!this.allListeners[ti]) this.allListeners[ti] = [];
            this.allListeners[ti].push(listener);
        }
    },
    /*移除监听*/
    removeListener: function (types, listener) {
        types = utils.trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            if (this.allListeners[ti]) utils.removeItem(this.allListeners[ti], listener);
        }
    },
    /*触发事件*/
    fireEvent: function () {
        var types = arguments[0];
        types = utils.trim(types).split(' ');
        for (var i = 0, ti; ti = types[i++];) {
            var listeners = this.allListeners[ti];
            if (listeners) {
                for (var j = 0, l; l = listeners[j++];) {
                    l.apply(this, arguments);
                }
            }
        }
    }
};