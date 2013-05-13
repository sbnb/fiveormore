/*
    Control a small div that appears and fades to black above a matched run,
    showing the points awarded for that run.
*/

function PointsPopup(popupDiv, textDiv, fadeTime, opacity) {

    this.display = display;

    this._popupDiv = tools.setIfUndefined(popupDiv, '#pointsPopup');
    this._textDiv = tools.setIfUndefined(textDiv, '#pointsText');
    this._fadeTime = tools.setIfUndefined(fadeTime, 300);
    this._opacity = tools.setIfUndefined(opacity, {upper: 1.0, lower: 0.4});

    function display(points, run) {
        var $popupDiv = $(this._popupDiv);
        $(this._textDiv).text(points);
        $popupDiv.centerOn($('table td').eqAnyOf(run));
        this._fadeToBlack($popupDiv);
    }

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
}
