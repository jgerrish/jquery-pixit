;(function($) {
      var methods = {
          init : function(options) {
              var opts = $.extend({}, $.fn.pixitPreview.defaults, options);
          },
          drawPixel : function(pos, color) {
          return this.each(function() {
                               var canvas = this;

                               if (canvas.getContext) {
                                   var ctx = canvas.getContext('2d');
                                   ctx.fillStyle = color;
                                   ctx.fillRect(pos.x, pos.y, 1, 1);
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
     };

})(jQuery);
