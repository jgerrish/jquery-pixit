;(function($) {

      $.fn.pixitPalette = function(options) {
          opts = $.extend({}, $.fn.pixitPalette.defaults, options);
          this_element = $(this);
          var paletteColors = opts.paletteColors;
          var canvas = opts.canvas;

          drawPalette = function(this_element, opts) {
              var palette = this_element;

              changeCurrentColor = function(color) {
                  currentColor = color;

                  var elementId = 'currentcolor';
                  var currentColorEl = document.getElementById(elementId);

                  currentColorEl.style.backgroundColor = color;
                  //$(this).data('currentColor', currentColor);
                  canvas.data('currentColor', currentColor);
              };

              startPaletteRectangle = function(evnt) {
                  var canvas = this_element;
                  var pos = mousePosition(evnt);
                  box_chosen = findBox(pos, opts);

                  if (box_chosen[0] > (opts.palette_width - 1)) {
                      box_chosen[0] = opts.palette_width - 1;
                  }
                  if (box_chosen[1] > (opts.palette_height - 1)) {
                      box_chosen[1] = opts.palette_height - 1;
                  }
                  var color = paletteColors[box_chosen[1] * 2 + box_chosen[0]];
                  changeCurrentColor(color);
              };

              if (palette.getContext) {
                  palette.setAttribute("width",
                                       opts.palette_width * opts.pixel_width +
                                       10);
                  palette.setAttribute("height",
                                       opts.palette_height * opts.pixel_height +
                                       10);
                  var ctx = palette.getContext('2d');

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

                  $(this_element).click(function(event) {
                      startPaletteRectangle(this, event);
                  });
              }
          };

          return this.each(function() {
                               drawPalette(this, opts);
                          });
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

    function mousePosition(this_element, evnt) {
          evnt = (evnt) ? evnt : ((window.event) ? window.event : "");

          var pos = globalToLocal(this_element, evnt.pageX, evnt.pageY);

          return pos;
      }

})(jQuery);
