/*
 * jQuery Pixel Editor Canvas widget plugin
 * A simple pixel editor widget for jQuery
 *
 * Usage:
 *
   $(document).ready(function () {
      $('canvas#canvas').pixitCanvas('init', {
        picture_width: 8,
        picture_height: 8,
        canvas_pixel_width: 50,
        canvas_pixel_height: 50,
        preview: $('canvas#preview')
      });
    });
 *
 * Copyright (c) Joshua Gerrish (http://www.joshuagerrish.com), 2011.
 * Dual-licensed under the BSD (BSD-LICENSE.txt) and GPL (GPL-LICENSE.txt)
 * licenses.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
;(function($) {
    var methods = {
        init : function(options) {
            return this.each(function() {
                init(this, options);
            });
        },
        changeCurrentColor : function(color) {
            return this.each(function() {
                $(this).data('currentColor', color);
            });
        },
        changePixelColor : changePixelColor,
        drawPixel : function(box_chosen, color) {
            return this.each(function() {
                drawPixel(this, box_chosen, color);
            });
        }
    };

    $.fn.pixitCanvas = function(method) {
        if (methods[method]) {
            return methods[method].apply(this,
                             Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.pixitCanvas');
        }
    };

    function drawPixel(this_element, box_chosen, color) {
        canvasPixels = $(this_element).data('canvasPixels');
        currentColor = $(this_element).data('currentColor');
        opts = $(this_element).data('opts');

        if (canvasPixels[box_chosen[1]][box_chosen[0]] == currentColor) {
            color = "#ffffff";
        } else {
            color = currentColor;
        }

        canvasPixels[box_chosen[1]][box_chosen[0]] = color;
        changePixelColor(this_element, opts, box_chosen, color);

        // Update the preview if there is one
        if (opts.preview) {
            opts.preview.pixitPreview('drawPixel', box_chosen, color);
        }
    };

    function startCanvasRectangle(this_element, evnt) {
        opts = $.fn.pixitCanvas.defaults;
        var pos = mousePosition(this_element, evnt, opts);

        startx = pos[0];
        starty = pos[1];

        box_chosen = findBox(pos, opts);

        if (box_chosen[0] > (opts.picture_width - 1)) {
            box_chosen[0] = opts.picture_width - 1;
        }
        if (box_chosen[1] > (opts.picture_height - 1)) {
            box_chosen[1] = opts.picture_height - 1;
        }

        drawPixel(this_element, box_chosen, "#000000");
    };

    function drawCanvas(this_element, opts) {
        var canvas = this_element;

        if (canvas.getContext) {
            canvas.setAttribute("width",
                                opts.picture_width * opts.canvas_pixel_width + 10);
            canvas.setAttribute("height",
                                opts.picture_height * opts.canvas_pixel_height + 10);
            var ctx = canvas.getContext('2d');

            for (y = 0; y <= opts.picture_height - 1; y++) {
                for (x = 0; x <= opts.picture_width - 1; x++) {
                    ctx.strokeStyle="#000000";
                    ctx.strokeRect(x * opts.canvas_pixel_width,
                                   y * opts.canvas_pixel_height,
                                   opts.canvas_pixel_width,
                                   opts.canvas_pixel_height);
                }
            }

            $(this_element).click(function(event) {
                startCanvasRectangle(this, event);
            });
        }
    };

    function init(this_element, options) {
        opts = $.extend({}, $.fn.pixitCanvas.defaults, options);
        preview = opts.preview;

        $(this_element).data('canvasPixels', []);
        $(this_element).data('opts', opts);
        $(this_element).data('currentColor', "#000000");
        initializeCanvas(this_element, opts);

        drawCanvas(this_element, opts);
    };

    function initializeCanvas(this_element, opts) {
        canvasPixels = $(this_element).data('canvasPixels');

        for (y = 0; y <= opts.picture_height - 1; y++) {
            var x = new Array(8);
            canvasPixels[y] = [x];
            for (x = 0; x <= opts.picture_width - 1; x++) {
                canvasPixels[y][x] = "#ffffff";
            }
        }
    };

    function changePixelColor(this_element, opts, box_chosen, color) {
        var ctx = this_element.getContext('2d');

        ctx.fillStyle = color;
        ctx.fillRect(box_chosen[0] * opts.canvas_pixel_width + 1,
                     box_chosen[1] * opts.canvas_pixel_height + 1,
                     opts.canvas_pixel_width - 2,
                     opts.canvas_pixel_height - 2);
    };

    $.fn.pixitCanvas.currentColor = function() {
        return $(this).data('currentColor');
    };

    $.fn.pixitCanvas.defaults = {
        canvas_pixel_width : 50,
        canvas_pixel_height : 50,
        picture_width: 8,
        picture_height: 8
    };


    function globalToLocal(this_element, globalX, globalY) {
        var offset = $(this_element).offset();

        return ([ Math.floor( globalX - offset.left ),
                  Math.floor( globalY - offset.top )
                ]);
    };

    function mousePosition(this_element, evnt, opts) {
        evnt = (evnt) ? evnt : ((window.event) ? window.event : "");

        var pos = globalToLocal(this_element, evnt.pageX, evnt.pageY);

        return pos;
    }

    function findBox(pos, opts) {
        var box_x = Math.floor(pos[0] / opts.canvas_pixel_width);
        var box_y = Math.floor(pos[1] / opts.canvas_pixel_height);

        return [box_x, box_y];
    }
})(jQuery);
