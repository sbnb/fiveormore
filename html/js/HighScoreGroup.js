(function () {

    "use strict";

    /*
        A grouping of all high scores: local, recent and allTime.
        Created by HighScoreAccessor.
    */

    FOM.HighScoreGroup = function (lists, highScoreAccessor) {
        this.local = lists.local;
        this.recent = lists.recent;
        this.allTime = lists.allTime;
        this._accessor = highScoreAccessor;
    };

    FOM.HighScoreGroup.prototype.isHighScore = function (score) {
        return (
            this.local.isHighScore(score) ||
            this.recent.isHighScore(score) ||
            this.allTime.isHighScore(score)
        );
    };

    // potentially adds a high score, writing to the server or cookie (local)
    FOM.HighScoreGroup.prototype.update = function (username, score, uniqId) {
        var isLocalHs = this.local.maybeAdd(username, score);
        if (isLocalHs) {
            this._accessor.writeLocal(username, this.local);
        }

        var isRecentHs = this.recent.maybeAdd(username, score),
            isAllTimeHs = this.allTime.maybeAdd(username, score);
        if (isRecentHs || isAllTimeHs) {
            this._accessor.writeServer(username, score, uniqId);
        }

    };

    // write the current high scores into the DOM
    FOM.HighScoreGroup.prototype.writeHighScoresToDom = function () {
        $('#localScores dl').html(this.local.wrapInHtml());
        $('#recentScores dl').html(this.recent.wrapInHtml());
        $('#allTimeScores dl').html(this.allTime.wrapInHtml());
    };

    FOM.HighScoreGroup.prototype.toString = function () {
        var buffer = 'HighScoreGroup:\n';
        buffer += 'Local ' + this.local;
        buffer += 'Recent ' + this.recent;
        buffer += 'AllTime ' + this.allTime;
        return buffer;
    };

})();
