function Score(pointsPopup) {
    // TODO: revert initial score to 0 when finished
    this.score = 5000;
    this._pointsPopup = pointsPopup;
}

Score.prototype = {

    POINTS_FOR_LENGTH: {5: 10, 6: 12, 7: 18, 8: 28, 9: 42},

    // add points for the given runs, return the number of points added.
    add: function (runs) {
        var preScore = this.score;
        _.forEach(runs, function (run) {
            assert(run.length >= constants.RUN_LENGTH, 'Score.add: run not long enough: ' + run.length);
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
