(function () {

    "use strict";

    FOM.Game2 = function () {
    };

    FOM.Game2.prototype.start = function () {
        this.logicalBoard.previewStones.addToBoard(this.logicalBoard);
    };

    // callback for GameEventConsumer to call when game over conditions met
    FOM.Game2.prototype.onGameOver = function () {
        var that = this,
            username = this.cookieHandler.readUsername(),
            score = this.score.get(),
            uniqId = this.cookieHandler.readUniqId();

        $('#finalScore span').text(score);

        this.highScoreAccessor.read(function (hsGroup) {
            that.highScoreGroup = hsGroup;  // cache the high scores

            if (hsGroup.isHighScore(score)) {
                that.popups.namePromptForHighScore(username);
            }
            // Otherwise just display fresh high scores
            else {
                hsGroup.writeHighScoresToDom();
                that.popups.playAgain();
            }
        });

    };

})();
