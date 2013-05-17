/*
    A grouping of all high scores: local, recent and allTime.
    Created by HighScoreAccessor.
*/

function HighScoreGroup(lists, highScoreAccessor) {
    this.local = lists.local;
    this.recent = lists.recent;
    this.allTime = lists.allTime;
    this._accessor = highScoreAccessor;
}

HighScoreGroup.prototype.update = function (username, score, uniqId) {
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

HighScoreGroup.prototype.toString = function () {
    var buffer = 'HighScoreGroup:\n';
    buffer += 'Local ' + this.local;
    buffer += 'Recent ' + this.recent;
    buffer += 'AllTime ' + this.allTime;
    return buffer;
};
