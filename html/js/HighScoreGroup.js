/*
    A grouping of all high scores: local, recent and allTime.
    Created by HighScoreAccessor.
*/

function HighScoreGroup(lists) {
    this.local = lists.local;
    this.recent = lists.recent;
    this.allTime = lists.allTime;
}

// check if a given score is a high score
HighScoreGroup.prototype.isHighScore = function (score) {
    var isHighScore = false;
    _.forEach([this.local, this.recent, this.allTime], function (highScoreList) {
        if (highScoreList.isHighScore(score)) {
            isHighScore = true;
        }
    });
    return isHighScore;
};

// TODO: update the lists with a username, score (just here, not server or cookie.., or?)
HighScoreGroup.prototype.update = function (username, score, uniqId) {
    // is it a local HS?
    // then add to this.local and accessor.writeLocal(username, this.local)

    // is it a recent HS?
    // then add to this.recent
    // is it a allTime HS?
    // then add to this.allTime

    // if it is either recent or allTime
    // then accessor.writeServer(username, score, uniqId)

};

HighScoreGroup.prototype.toString = function () {
    var buffer = 'HighScoreGroup:\n';
    buffer += 'Local ' + this.local;
    buffer += 'Recent ' + this.recent;
    buffer += 'AllTime ' + this.allTime;
    return buffer;
};
