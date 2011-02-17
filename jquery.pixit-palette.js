/*
 * jQuery Pixit Palette plugin
 * A color chooser palette widget for jQuery
 *
 * Usage:
 *
   $(document).ready(function () {
      $('canvas#palette').pixitPalette({
        pixel_width: 50,
        pixel_height: 50
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
                changeCurrentColor(this, color);
            });
        },
    };

    $.fn.pixitPalette = function(method) {
        if (methods[method]) {
            return methods[method].apply(this,
                           Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.pixitCanvas');
        }
    };

    function init(this_element, options) {
        opts = $.extend({}, $.fn.pixitPalette.defaults, options);

        $(this_element).data('opts', opts);
        $(this_element).data('drawingCanvas', opts.drawingCanvas);
        $(this_element).data('paletteColors', opts.paletteColors);
        $(this_element).data('currentColor', opts.currentColor);


        if (opts.currentColorCanvas) {
            $(this_element).data('currentColorCanvas', opts.currentColorCanvas);
        }

        drawPalette(this_element, opts);

        $(this_element).click(function(event) {
            startPaletteRectangle(this, event);
        });
    };

    function drawPalette(this_element, opts) {
        paletteColors = $(this_element).data('paletteColors');
        var canvas = opts.canvas;

        if (this_element.getContext) {
            this_element.setAttribute("width",
                                 opts.palette_width * opts.pixel_width +
                                 10);
            this_element.setAttribute("height",
                                 opts.palette_height * opts.pixel_height +
                                 10);
            var ctx = this_element.getContext('2d');

            for (y = 0; y <= opts.palette_height - 1; y++) {
                for (x = 0; x <= opts.palette_width - 1; x++) {
                    ctx.strokeStyle="#000000";
                    ctx.strokeRect(x * opts.pixel_width,
                                   y * opts.pixel_height,
                                   opts.pixel_width,
                                   opts.pixel_height);

                    ctx.fillStyle = paletteColors[y * 2 + x];
                    ctx.fillRect(x * opts.pixel_width + 1,
                                 y * opts.pixel_height + 1,
                                 opts.pixel_width - 2,
                                 opts.pixel_height - 2);
                }
            }
        }
    };

    function changeCurrentColor(this_element, color) {
        $(this_element).data('currentColor', color);

        currentColorCanvas = $(this_element).data('currentColorCanvas');
        drawingCanvas = $(this_element).data('drawingCanvas');

        if (currentColorCanvas) {
            currentColorCanvas.css("backgroundColor", color);
        }

        if (drawingCanvas) {
            drawingCanvas.pixitCanvas('changeCurrentColor', color);
        }
    };

    function startPaletteRectangle(this_element, evnt) {
        var pos = mousePosition(this_element, evnt, opts);
        opts = $(this_element).data('opts');

        box_chosen = findBox(pos, opts);

        if (box_chosen[0] > (opts.palette_width - 1)) {
            box_chosen[0] = opts.palette_width - 1;
        }
        if (box_chosen[1] > (opts.palette_height - 1)) {
            box_chosen[1] = opts.palette_height - 1;
        }

        paletteColors = $(this_element).data('paletteColors');

        var color = paletteColors[box_chosen[1] * 2 + box_chosen[0]];
        changeCurrentColor(this_element, color);
    };

     $.fn.pixitPalette.defaults = {
         paletteColors: [
             "#ffffff", "#000000", "#ff0000", "#00ff00",
             "#0000ff", "#8000ff", "#808000", "#808080"
         ],
         currentColor: "#000000",
         palette_width: 2,
         palette_height: 4,
         pixel_width : 50,
         pixel_height : 50
     };

      function findBox(pos, opts) {
          var box_x = Math.floor(pos[0] / opts.pixel_width);
          var box_y = Math.floor(pos[1] / opts.pixel_height);

          return [box_x, box_y];
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

})(jQuery);
