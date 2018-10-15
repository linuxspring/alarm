//获取js的文档路径
// var teoyallScrollJs = document.scripts;
// teoyallScrollJs = teoyallScrollJs[teoyallScrollJs.length-1].src.substring(0,teoyallScrollJs[teoyallScrollJs.length-1].src.lastIndexOf("/")+1);
// // $(document).ready(function(){
// //     $('script').eq(0).after('<link rel="stylesheet" href="'+teoyallScrollJs+'teoyallScroll.css">');
// // });
//监控DIV resize事件插件
(function ($, h, c) {
    var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {w: l.width(), h: l.height()});
            if (a.length === 1) {
                g()
            }
        }, teardown: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i)
            }
        }, add: function (l) {
            if (!e[f] && this[k]) {
                return false
            }
            var n;

            function m(s, o, p) {
                var q = $(this), r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments)
            }

            if ($.isFunction(l)) {
                n = l;
                return m
            } else {
                n = l.handler;
                l.handler = m
            }
        }
    };
    function g() {
        i = h[k](function () {
            a.each(function () {
                var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l])
                }
            });
            g()
        }, e[b])
    }
})(jQuery, this);
(function ($) {
    $.fn.teoyallScroll = function (options, Callback) {
        //定义基本属性
        var defaults = {
            cover: false,
            style: ''
        }
        //迭代默认属性
        var ops = $.extend(defaults, options);

        //创建元素
        function creatEle(label, className, style) {
            var result = '<' + label + ' class="' + className + '"></' + label + '>';
            return result;
        }

        return this.each(function () {
            var $this = $(this);
            var thisHtml = $this.html();
            var thisWidth = $this.width();
            var thisHeight = $this.height();
            var $scrollWrapper = $(creatEle('div', 'scroll-wrapper ' + ops.style));
            var $scrollContent = $(creatEle('div', 'scroll-content'));
            var $scrollBar = $(creatEle('div', 'scroll-bar'));
            var $scrollBtn = $(creatEle('div', 'scroll-btn'));
            var scrollWrapperWidth, scrollWrapperHeight, scrollContentHeight, scrollBtnHeight, scrollBtnTop, range, speed, frontier;

            if (!ops.cover) {
                scrollWrapperWidth = thisWidth - 10;
            } else {
                scrollWrapperWidth = thisWidth;
            }

            $this.html($scrollWrapper);
            $scrollWrapper.append($scrollContent);
            $scrollWrapper.append($scrollBar);
            $scrollBar.append($scrollBtn);
            $scrollContent.append(thisHtml);

            scrollWrapperHeight = $scrollWrapper.outerHeight(true);   //获取重新包装内容容器的高度
            if (scrollWrapperHeight <= thisHeight) {
                $this.html(thisHtml);
                $scrollContent = $scrollBar = $scrollBtn = $scrollWrapper = thisHtml = null;
                return;
            }

            $this.css('overflow', 'hidden');
            $scrollContent.css('width', scrollWrapperWidth + 'px');
            $scrollWrapper.css({'width': thisWidth + 'px', 'height': thisHeight + 'px', 'overflow': 'hidden'});
            $scrollBar.css('height', (thisHeight - 2) + 'px');
            scrollContentHeight = $scrollContent.outerHeight(true);
            scrollBtnHeight = thisHeight / scrollContentHeight * 100;
            $scrollBtn.css('height', scrollBtnHeight + '%');
            speed = (thisHeight - 2) / (scrollContentHeight / (thisHeight / 1.5));

            $scrollContent.on('resize', function () {
                scrollContentHeight = $scrollContent.outerHeight(true);
                if (scrollContentHeight <= thisHeight) {
                    $scrollBar.css('display', 'none');
                    return;
                }
                $scrollBar.css('display', 'block');
                scrollBtnHeight = thisHeight / scrollContentHeight * 100;
                $scrollBtn.css('height', scrollBtnHeight + '%');
                scrollBtnTop = $scrollBtn.position().top / (thisHeight - 2) * 100;
                frontier = 100 - (scrollBtnHeight + scrollBtnTop);
                if (frontier < 0) {
                    scrollBtnTop = (scrollBtnTop + frontier);
                    $scrollBtn.css('top', scrollBtnTop + '%');
                    $scrollContent.css('top', -(scrollContentHeight - thisHeight) + 'px');
                }
            });

            $scrollBtn.on('mousedown', function (ev) {
                var that = $(this);
                var eventY = ev.pageY;
                scrollBtnTop = that.position().top;
                $(document).on('mousemove', function (ev) {
                    ev.preventDefault();
                    $scrollBar.css('opacity', 1);
                    range = (scrollBtnTop + (ev.pageY - eventY)) / (thisHeight - 2) * 100;
                    if (range < 0) {
                        range = 0;
                    } else if (range > (100 - scrollBtnHeight)) {
                        range = 100 - scrollBtnHeight;
                    }
                    that.css('top', range + '%');
                    $scrollContent.css('top', -(range * (scrollContentHeight) / 100) + 'px');
                });
                $(document).on('mouseup', function () {
                    $(document).off('mousemove').off('mouseup');
                    $scrollBar.css('opacity', '');
                });
                return false;
            });

            //滚动滚轮操作滚动条
            $this.hover(function () {
                $(document).on("mousewheel DOMMouseScroll", function (e) {
                    var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
                    scrollBtnTop = $scrollBtn.position().top;
                    if (delta > 0) {  //向上滚
                        range = (scrollBtnTop - speed) / (thisHeight - 2) * 100;
                        if (range < 0) {
                            range = 0;
                        } else if (range > (100 - scrollBtnHeight)) {
                            range = 100 - scrollBtnHeight;
                        }
                        $scrollBtn.stop().animate({top: range + '%'}, 300);
                        $scrollContent.stop().animate({top: -(range * (scrollContentHeight) / 100) + 'px'}, 300);
                    } else if (delta < 0) {    //向下滚
                        range = (scrollBtnTop + speed) / (thisHeight - 2) * 100;
                        if (range < 0) {
                            range = 0;
                        } else if (range > (100 - scrollBtnHeight)) {
                            range = 100 - scrollBtnHeight;
                        }
                        $scrollBtn.stop().animate({top: range + '%'}, 300);
                        $scrollContent.stop().animate({top: -(range * (scrollContentHeight) / 100) + 'px'}, 300);
                    }
                    return false;
                });
            }, function () {
                $(document).off('mousewheel DOMMouseScroll');
            });
        });
    }
})(jQuery);