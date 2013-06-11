(function () {

    "use strict";

    FOM.LocalHighScoreWriter = function (cookieHandler) {
        this._cookieHandler = cookieHandler;
    };

    FOM.LocalHighScoreWriter.prototype.write = function (name, localScores) {
        var sanitisedName = name === "" ? "anonymous" : name;
        this._cookieHandler.saveUsername(sanitisedName);
        this._cookieHandler.saveLocalHighScores(localScores.toArray());
    };

})();
