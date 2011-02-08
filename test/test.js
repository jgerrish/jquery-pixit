$(document).ready(function() {
    module("pixit-preview module");

    test("Initialize pixit-preview", function() {
        expect(1);
        /* Test we're returning so chaining works */
        ok($('canvas#preview').pixitPreview(), "initialize pixit-preview");
    });

    module("pixit-canvas module");

    test("Initialize default pixit-canvas", function() {
        expect(66);
        /* Test we're returning so chaining works */
        ok($('canvas#canvas').pixitCanvas(), "initialize pixit-canvas");

        /* Test that the canvas is initialized to white pixels */
        var pixels = $('canvas#canvas').data('canvasPixels');
        equals(8, pixels.length);
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                equals("#ffffff", pixels[i][j]);
            }
        }
    });

    test("pixit-canvas drawPixel", function() {
        expect(4);
        ok($('canvas#canvas').pixitCanvas(), "initialize pixit-canvas");

        /* Test drawing works */
        ok($('canvas#canvas').pixitCanvas('drawPixel', [0, 0], "#000000"),
           "drawing on canvas");
        var pixels = $('canvas#canvas').data('canvasPixels');
        equals(8, pixels.length);
        equals("#000000", pixels[0][0]);
    });

    test("pixit-canvas draws on linked preview", function() {
        expect(4);
        ok($('canvas#preview').pixitPreview(), "initialize pixit-preview");
        ok($('canvas#canvas').pixitCanvas( { preview: $('canvas#preview') } ),
           "initialize pixit-canvas");
        ok($('canvas#canvas').pixitCanvas('drawPixel', [0,0], "#000000"),
           "draw on canvas");
        var pixels = $('canvas#preview').data('canvasPixels');
        equals(pixels[0][0], "#000000");
    });

    module("pixit-palette module");

    test("Initialize pixit-palette", function() {
        expect(1);
        ok($('canvas#palette').pixitPalette(), "initialize pixit-palette");
    });

    test("Change pixit-palette current color", function() {
        expect(3);

        ok($('canvas#palette').pixitPalette(), "initialize pixit-palette");

        var color = "#303030";
        ok($('canvas#palette').pixitPalette('changeCurrentColor', color),
           "change current palette color");

        var newColor = $('canvas#palette').data('currentColor');
        equals(newColor, color);
    });

    test("Changing the current color on the palette updates the linked pixit-canvas", function() {
        expect(5);
        ok($('canvas#canvas').pixitCanvas(), "initialize pixit-canvas");

        ok($('canvas#palette').pixitPalette({
            drawingCanvas: $('canvas#canvas')
        }), "initialize pixit-palette");

        var color = "#303030";
        ok($('canvas#palette').pixitPalette('changeCurrentColor', color),
           "change current palette color");

        var newColor = $('canvas#palette').data('currentColor');
        equals(newColor, color);

        newColor = $('canvas#canvas').data('currentColor');
        equals(newColor, color);
    });
});
