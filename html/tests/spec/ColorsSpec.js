describe('Colors', function() {

    var colors;

    beforeEach(function() {
        colors = new FOM.Colors();
    });

    it('returns right number of colors', function() {
        var randCols = colors.getRandom(3);
        expect(randCols.length).toBe(3);
    });

    it('returns random colors', function() {
        var colors1 = [],
            colors2 = [];

        for (var idx = 0; idx < 10; idx += 1) {
            colors1 = colors1.concat(colors.getRandom(6));
            colors2 = colors2.concat(colors.getRandom(6));
        }

        expect(colors1.length).toBe(60);
        expect(colors2.length).toBe(60);
        expect(colors1).not.toEqual(colors2);
    });

});

