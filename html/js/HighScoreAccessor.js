/*
    Responsible for obtaining the 3 lists of high scores:
        local: from the local machine (currently cookie)
        recent: from server, recent high scores
        allTime: from server, all time highScores

    Packages these up into a HighScoreGroup object.

    Writes new high scores locally and to server.
*/

// expects options to contain local and server readers and writers
function HighScoreAccessor(options) {
    this._localReader = options.localHighScoreReader;
    this._serverReader = options.serverHighScoreReader;
    this._localWriter = options.localHighScoreWriter;
    this._serverWriter = options.serverHighScoreWriter;
}

// Send a HighScoreGroup object with all high scores,
// via callback function
HighScoreAccessor.prototype.read = function (callback) {
    var group,
        lists = {};

    lists.local = this._localReader.read();

    this._serverReader.read(function (serverLists) {
        lists.recent = serverLists.recent;
        lists.allTime = serverLists.allTime;
        group = new HighScoreGroup(lists);
        callback(group);
    });
};

HighScoreAccessor.prototype.writeLocal = function (username, localScoresList) {
    this._localWriter.write(username, localScoresList);
};

HighScoreAccessor.prototype.writeServer = function (username, score, uniqId) {
    this._serverWriter.write(username, score, uniqId);
};
