(function () {

    "use strict";

    FOM.LocalHighScoreWriter = function (cookieHandler) {
        this._cookieHandler = cookieHandler;
    };

    FOM.LocalHighScoreWriter.prototype.write = function (username, localHighScores) {
        var sanitisedName = username === "" ? "anonymous" : username;
        this._cookieHandler.saveUsername(sanitisedName);
        this._cookieHandler.saveLocalHighScores(localHighScores.toArray());

    };

})();
