(function () {

    "use strict";

    FOM.LocalHighScoreWriter = function (cookieHandler) {
        this._cookieHandler = cookieHandler;
    };

    FOM.LocalHighScoreWriter.prototype.write = function (name, localScores) {
        this._cookieHandler.saveUsername(name);
        this._cookieHandler.saveLocalHighScores(localScores.toArray());
    };

})();
