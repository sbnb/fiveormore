// TODO: add game end checks in Game2.js
function Game2() {
}

Game2.prototype.start = function () {
    console.log('starting game');
    this.logicalBoard.previewStones.addToBoard(this.logicalBoard);
};

// callback for GameEventConsumer to call when game over conditions met
Game2.prototype.onGameOver = function (ausername, ascore, auniqId) {
    var that = this,
        username = this.cookieHandler.readUsername(),
        score = this.score.get(),
        uniqId = this.cookieHandler.readUniqId();


    console.log('Game2.onGameOver: ending game: ' + username + ' ' + score + ' ' +  uniqId);

    $('#finalScore span').text(score);

    this.highScoreAccessor.read(function (hsGroup) {
        that.highScoreGroup = hsGroup;  // save the high scores in Game

        if (hsGroup.isHighScore(score)) {
            console.log('Game2.onGameOver: got a high score: ' + score);
            // TODO: change to namePromptForHighScore
            that.popups.namePromptForHighScore(username);
        }
        // 2.2 Otherwise just display fresh high scores
        else {
            console.log('Game2.onGameOver: not a high score: ' + score);
            hsGroup.writeHighScoresToDom();
            that.popups.playAgain();
        }
    });

};
