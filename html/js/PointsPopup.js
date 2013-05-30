(function () {

    "use strict";

    /*
        Control a small div that appears and fades to black above a matched run,
        showing the points awarded for that run.
    */

    FOM.PointsPopup = function (popupDiv, textDiv, fadeTime, opacity) {

        var define = FOM.tools.setIfUndefined;
        this._popupDiv = define(popupDiv, '#pointsPopup');
        this._textDiv = define(textDiv, '#pointsText');
        this._fadeTime = define(fadeTime, 300);
        this._opacity = define(opacity, {upper: 1.0, lower: 0.4});

        this.display = function (points, run) {
            var $popupDiv = $(this._popupDiv);
            $(this._textDiv).text(points);
            $popupDiv.centerOn($('table td').eqAnyOf(run));
            this._fadeToBlack($popupDiv);
        };

        this._fadeToBlack = function ($popupDiv) {
            $popupDiv.show();
            $popupDiv.animate({
                    opacity: this._opacity.lower,
                    top: '-=30'
                },
                this._fadeTime,
                function() {
                    $popupDiv.hide();
                });
        };
    };

})();
