/*
    Reads local high scores from cookie.
*/

function LocalHighScoreReader(cookieHandler, limit) {
    this._cookieHandler = cookieHandler;
    this._limit = limit;
}

/* Return a HighScoreList of the local scores */
LocalHighScoreReader.prototype.read = function () {
    var localScoresList = new HighScoreList(this._limit),
        localArray = this._cookieHandler.readLocalHighScores(),
        NAME = 0,
        SCORE = 1;

    // add each of them to a high score list object
    _.forEach(localArray , function (item) {
        localScoresList.maybeAdd(item[NAME], item[SCORE]);
    });

    return localScoresList;
};
