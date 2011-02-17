/*
 * jQuery Preview widget plugin
 * A simple image editor preview widget for jQuery
 *
 * Usage:
 *
   $(document).ready(function () {
      $('canvas#preview').pixitPreview();
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
                var opts = $.extend({}, $.fn.pixitPreview.defaults, options);
                $(this).data('canvasPixels', []);

                canvasPixels = $(this).data('canvasPixels');

                for (y = 0; y <= opts.height - 1; y++) {
                    var x = new Array(8);
                    canvasPixels[y] = [x];
                    for (x = 0; x <= opts.width - 1; x++) {
                        canvasPixels[y][x] = "#ffffff";
                    }
                }

            });
          },
          drawPixel : function(pos, color) {
              return this.each(function() {
                  canvasPixels = $(this).data('canvasPixels');
                  if (this.getContext) {
                      var ctx = this.getContext('2d');
                      ctx.fillStyle = color;
                      ctx.fillRect(pos[0], pos[1], 1, 1);

                      canvasPixels[pos[1]][pos[0]] = color;
                  }
              });
          }
      };

      $.fn.pixitPreview = function(method) {
          if ( methods[method] ) {
              return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
          } else if ( typeof method === 'object' || ! method ) {
              return methods.init.apply( this, arguments );
          } else {
              $.error( 'Method ' +  method + ' does not exist on jQuery.pixitPreview' );
          }
      };

     $.fn.pixitPreview.defaults = {
        width: 8,
        height: 8
     };

})(jQuery);
