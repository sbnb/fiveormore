function LocalHighScoreWriter(cookieHandler) {
    this._cookieHandler = cookieHandler;
}

LocalHighScoreWriter.prototype.write = function (username, localHighScores) {
    var sanitisedName = name === "" ? "anonymous" : name;
    this._cookieHandler.saveUsername(sanitisedName);
    this._cookieHandler.saveLocalHighScores(localHighScores.toArray());

};

