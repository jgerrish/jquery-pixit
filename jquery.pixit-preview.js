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
