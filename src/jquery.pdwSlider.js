/*
 * Copyright (c) 2013 Benjamin Michotte <benjamin@produweb.be>
 *     ProduWeb SA <http://www.produweb.be>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
if (jQuery)
{
    (function($)
    {
        $.fn.pdwSlider = function(method)
        {
            var options = $(this).data('options');
            if (methods[method])
            {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else if (typeof method === 'object' || !method)
            {
                return methods.init.apply(this, arguments);
            }
            else
            {
                $.error('Method ' + method + ' does not exist on jQuery.pdwSlider');
                return null;
            }
        };

        var methods =
        {
            init: function(userOptions)
            {
                var options =
                {
                    animationSpeed: 500,
                    animationDelay: 4500,
                    beforeChange: false,
                    afterChange: false,
                    easing: "swing",
                    autostart: true,
                    is_fullscreen: true
                };
                $.extend(true, options, userOptions || {});

                return this.each(function()
                {
                    $(this).data('options', options);
                    $(this).data('actual', 0);
                    $(this).pdwSlider('prepare');
                    if (false !== options.autostart && true === options.is_fullscreen)
                    {
                        $(this).pdwSlider('start');
                    }
                });
            },
            prepare: function()
            {
                var container = $(this).css({
                        overflow: 'hidden',
                        position: 'relative'
                    }),
                    options = $(this).data('options'),
                    width = container.width();

                $(this).data('container-width', width);

                if (false === options.is_fullscreen)
                {
                    var position = 0,
                        childWidth = container.children('div').eq(0).width();
                    container
                        .children('div')
                        .css({
                            position: 'absolute',
                            top: 0
                        })
                        .each(function()
                        {
                            $(this).css({
                                left: childWidth * position
                            });
                            position++;
                        });
                    $(this).data('max-width', childWidth * container.children('div').length);
                }
                else
                {
                    container
                        .children('div')
                        .css({
                            position: 'absolute',
                            top: 0
                        })
                        .not(':first-child')
                        .css({
                            left: width
                        });
                    container.hover(function()
                        {
                            $(this).pdwSlider('stop');
                        },
                        function()
                        {
                            if ($(this).data('interval') == null || false === options.autostart)
                            {
                                return;
                            }
                            $(this).pdwSlider('start');
                        });
                }
            },
            stop: function()
            {
                var options = $(this).data('options');
                if (false === options.is_fullscreen)
                {
                    return;
                }
                clearInterval($(this).data('interval'));
                $(this).data('interval', null);
            },
            previous: function()
            {
                var options = $(this).data('options'),
                    children = $(this).children('div'),
                    width = $(this).width();

                if (false === options.is_fullscreen)
                {
                    var maxWidth = $(this).data('max-width'),
                        firstChildLeft = Math.abs(children.eq(0).position().left);
                    if (firstChildLeft + width >= maxWidth)
                    {
                        return;
                    }
                    children.each(function()
                    {
                        $(this).stop(true, true).animate({
                            left: $(this).position().left - $(this).width()
                        }, options.animationSpeed, options.easing);
                    });
                }
                else
                {
                    var actual = $(this).data('actual'),
                        actualChildren = $(children[actual]),
                        previous = actual - 1;
                    if (previous < 0)
                    {
                        previous = children.length - 1;
                    }
                    var previousChildren = $(children[previous]);
                    previousChildren.css({
                        left: -width
                    });

                    actualChildren.stop(true, true).animate({
                        left: width
                    }, options.animationSpeed, options.easing);

                    previousChildren.stop(true, true).animate({
                        left: 0
                    }, options.animationSpeed, options.easing);
                    $(this).data('actual', previous);
                }
            },
            next: function()
            {
                var options = $(this).data('options'),
                    children = $(this).children('div'),
                    width = $(this).width();

                if (false === options.is_fullscreen)
                {
                    var firstChildLeft = children.eq(0).position().left;
                    if (firstChildLeft >= 0)
                    {
                        return;
                    }
                    children.each(function()
                    {
                        $(this).stop(true, true).animate({
                            left: $(this).position().left + $(this).width()
                        }, options.animationSpeed, options.easing);
                    });
                }
                else
                {
                    var actual = $(this).data('actual'),
                        actualChildren = $(children[actual]),
                        next = actual + 1;
                    if (next >= children.length)
                    {
                        next = 0;
                    }
                    var nextChildren = $(children[next]);

                    actualChildren.stop(true, true).animate({
                        left: -width
                    }, options.animationSpeed, options.easing, function()
                    {
                        $(this).css({
                            left: width
                        });
                    });
                    nextChildren.stop(true, true).animate({
                        left: 0
                    }, options.animationSpeed, options.easing);
                    $(this).data('actual', next);
                }
            },
            start: function()
            {
                var container = $(this),
                    options = $(this).data('options'),
                    children = container.children('div'),
                    interval;
                if (false === options.is_fullscreen)
                {
                    return;
                }
                if (children.length <= 1)
                {
                    return;
                }

                interval = setInterval(function()
                {
                    container.pdwSlider('next');
                }, options.animationDelay);
                $(this).data('interval', interval);
            }
        };
    })(jQuery);
}