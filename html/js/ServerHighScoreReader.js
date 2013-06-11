(function () {

    "use strict";

    /*
        Reads recent and allTime server high scores.
    */

    FOM.ServerHighScoreReader = function (limit) {
        this._limit = limit;
    };

    // returns an object {recent: hsListObj, allTime: hsListObj} where values
    // are HighScoreList objects
    FOM.ServerHighScoreReader.prototype.read = function (callback) {
        var that = this;

        // results looks like:
        //     {allTime:[[name,score]...[]], recent:[[name,score]...[]]}
        getHighScoresFromServer(function (results) {
            var highScores = {};
            highScores.recent = that._buildHighScoreObj(results.recent);
            highScores.allTime = that._buildHighScoreObj(results.allTime);
            callback(highScores);
        });
    };

    FOM.ServerHighScoreReader.prototype._buildHighScoreObj =
        function (highScoreArray) {
            var highScoreList = new FOM.HighScoreList(this._limit),
                NAME = 0,
                SCORE = 1;

            // add each array entry to high score list object
            _.forEach(highScoreArray, function (item) {
                highScoreList.maybeAdd(item[NAME], item[SCORE]);
            });
            return highScoreList;
        };

    function getHighScoresFromServer(successFunction) {
        $("#loading").show();
        $.ajax({
            url: 'server.php',
            type: 'POST',
            data: 'q=getHighScores',
            success: function (result) {
                $("#loading").hide();
                successFunction(JSON.parse(result));
            }
        });
    }

})();
