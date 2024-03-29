(function () {

    "use strict";

    var t = FOM.tools;
    var c = FOM.constants;

    /*
        Score

        Maintains the current score, and provides mapping from run lengths
        to points awarded.
    */

    FOM.Score = function (pointsPopup) {
        this.score = 0;
        this._pointsPopup = pointsPopup;
    };

    FOM.Score.prototype = {

        // points awarded for runs of given length
        POINTS_FOR_LENGTH: {5: 10, 6: 12, 7: 18, 8: 28, 9: 42},

        // add points for the given runs, return the number of points added.
        add: function (runs) {
            var preScore = this.score;
            _.forEach(runs, function (run) {
                t.assert(run.length >= c.RUN_LENGTH,
                    'Score.add: run not long enough: ' + run.length);

                var points = this.POINTS_FOR_LENGTH[run.length];
                this.score += points;
                this._pointsPopup.display(points, run);
            }, this);
            return this.score - preScore;
        },

        get: function () {
            return this.score;
        }
    };

})();
