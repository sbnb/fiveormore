describe('PointsPopup', function() {

    var popup,
        popupDiv = '#pointsPopup',
        textDiv = '#pointsText',
        opacity = {upper: 1.0, lower: 0.4},
        points = 5,
        someRefToDomLocationOfMiddleOfRun = null,
        fadeOut = 1;

    beforeEach(function() {
        popup = new PointsPopup(popupDiv, textDiv, fadeOut, opacity);
        popup.display(points, [1,2,3,4,5]);
    });

    it('changes text of #pointsText to awarded points', function() {
        expect($(textDiv).text()).toBe(points.toString());
    });


    // check the div is in right place


    // check it goes opaque after delay
    it('fades out after delay', function() {
        waitsFor(function() {
            var actualOpacity = parseFloat($(popupDiv).css('opacity'));
            return actualOpacity.toFixed(1) === (opacity.lower).toFixed(1);
        }, "cond", 100);

        runs(function() {
            var actualOpacity = parseFloat($(popupDiv).css('opacity'));
            expect(actualOpacity.toFixed(1)).toBe((opacity.lower).toFixed(1));
        });

    });

});
